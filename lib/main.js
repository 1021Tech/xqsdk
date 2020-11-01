const { FutureCTP } = require('futurectp');
// const EventEmitter = require('eventemitter3');
const { EventEmitter } = require('events');

class XQSdk extends EventEmitter {
  constructor() {
    super();
    this.ctpMap = Object.create(null);
  }

  addAccount(params) {
    const ctp = new FutureCTP(params, { marketAutoInit: false });
    const { td, user, nReqId } = ctp;
    
    const ctpCount = Object.keys(this.ctpMap).length;
    if (ctpCount === 0) {
      ctp.initMarket();
      const md = ctp.md;

      md.on('FrontConnected', () => {
        const code = md.reqUserLogin(user, nReqId());
        console.log(`${user.userId} md login`, code === 0 ? 'success' : 'failed');
        this.emit('connected');
      });

      md.on('FrontDisconnected', (reason) => {
        this.emit('disconnected', ctp.user, reason);
      });

      md.on('RspError', (rsp, nReqId, bIsLast) => {
        if (bIsLast) {
          this.emit('error', ctp.user, rsp, nReqId);
        }
      });

      md.on('RtnDepthMarketData', (data) => {
        this.emit('rtnData', data);
      });

      this._bindMarketMethod(md);
    }

    td.on('FrontConnected', () => {
      console.log(ctp.user.userId, 'td login', td.reqUserLogin(ctp.user, ctp.nReqId()) === 0 ? 'success' : 'failed');
    });

    td.on('FrontDisconnected', (reason) => {
      this.emit('disconnected', ctp.user, reason);
    });

    td.on('RspError', (rsp, nReqId, bIsLast) => {
      if (bIsLast) {
        this.emit('error', ctp.user, rsp, nReqId);
      }
    });

    td.on('RspOrderInsert', (data, rsp, nReqId, bIsLast) => {
      if (bIsLast) {
        this.emit('notify', data, rsp, nReqId);
      }
    });

    td.on('RspOrderAction', (data, rsp, nReqId, bIsLast) => {
      if (bIsLast) {
        this.emit('notify', data, rsp, nReqId);
      }
    });

    td.on('RtnOrder', (data) => {
      if (bIsLast) {
        this.emit('rtnData', data);
      }
    });

    td.on('RtnTrade', (data) => {
      if (bIsLast) {
        this.emit('rtnData', data);
      }
    });

    this.ctpMap[user.userId ] = ctp;
  }

  _bindMarketMethod(md) {
    this.subscribeQuote = (symbols = []) => {
      md.subscribeMarketData(symbols, symbols.length);
    };
  }

}

module.exports = XQSdk;

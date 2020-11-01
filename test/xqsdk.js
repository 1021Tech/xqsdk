const XQSdk = require('../lib/main');

const sdk = new XQSdk();
sdk.addAccount({
  broker: {
    brokerId: '4040',
    brokerName: '银河期货',
    mdUrl: 'tcp://180.166.103.21:55213',
    tdUrl: 'tcp://180.166.103.21:55205'
  },
  user: {
    userId: '369868',
    password: 'iguzhi'
  }
});

sdk.addAccount({
  broker: {
    brokerId: '4040',
    brokerName: '银河期货',
    mdUrl: 'tcp://180.166.103.21:55213',
    tdUrl: 'tcp://180.166.103.21:55205'
  },
  user: {
    userId: '369863',
    password: 'iguzhi'
  }
});

sdk.on('connected', function() {
  sdk.subscribeQuote(['ag2012']);
});

sdk.on('disconnected', function(data) {
  console.log('disconnected', data);
});

sdk.on('rtnData', function(data) {
  console.log('rtnData', data);
});

sdk.on('error', function(error) {
  // console.clear();
  console.log('error', error);
});

sdk.on('notify', function(data) {
  // console.clear();
  console.log('notify', data);
});

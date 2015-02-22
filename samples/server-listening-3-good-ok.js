'use strict';

var http = require('http')
  , net = require('net')
  , hack = require('../lib/hack')
  , port = 3000
  , wait;

hack.enable(net.Server.prototype, 'listen', function () {
  var that = this
    , args = arguments;
  if (wait) {
    setTimeout(function () {
      that.orig.apply(that, args);
    }, wait);
  } else {
    setImmediate(function () {
      that.orig.apply(that, args);
    });
  }
});

function run() {
  var server;

  function doRequest() {
    var client;
    client = http.request({port: port}, function (res) {
      var body;
      console.log('response status :', res.statusCode);
      res.on('data', function (data) {
        body = (body || '') + data;
      });
      res.on('end', function () {
        console.log('response body :', body);
        server.close(function () { // Don't forget to handle the callback!
          console.log('server closed');
        });
      });
    });
    client.end();
  }

  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
  });
  server.listen(port, function () { // Don't forget to handle the callback!
    console.log('server listening on port %s', port);
    doRequest();
  });
}

if (require.main === module) {
  run();
} else {
  exports = module.exports = run;
}
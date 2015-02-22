'use strict';

var http = require('http')
  , net = require('net')
  , hack = require('../lib/hack')
  , port = 3000;

//process.env['NODE_DEBUG'] = 'http net';


function bad() {
  var server, client;
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  });
  client = http.request({port: port}, function (res) {
    var body;
    console.log('response status :', res.statusCode);
    res.on('data', function (data) {
      body = (body || '') + data;
    });
    res.on('end', function () {
      console.log('response body :', body);
      server.close();
    });
  });
  server.listen(port);
  //console.log('server listening on port %s', port);
  client.end();
}

function good() {
  var server, client;
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
  });
  server.listen(port, function () {
    console.log('server listening on port %s', port);
    client = http.request({port: port}, function (res) {
      var body;
      console.log('response status :', res.statusCode);
      res.on('data', function (data) {
        body = (body || '') + data;
      });
      res.on('end', function () {
        console.log('response body :', body);
        server.close();
      });
    });
    client.end();
  });
}

hack.enable(net.Server.prototype, 'listen', function () {
  var that = this
    , args = arguments;
  setImmediate(function () {
    that.orig.apply(that, args);
  });
});

hack.disable(net.Server.prototype, 'listen');

bad();
//good();
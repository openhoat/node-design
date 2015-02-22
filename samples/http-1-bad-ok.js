'use strict';

var http = require('http')
  , port = 3000;

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
        server.close();
        console.log('server closed');
      });
    });
    client.end();
  }

  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
  });
  server.listen(port);
  console.log('server listening on port %s', port);
  doRequest();
}

if (require.main === module) {
  run();
} else {
  exports = module.exports = run;
}
'use strict';

var http = require('http')
  , port = 3000;

function run() {
  var server, client;
  server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World');
  });
  client = http.request({port: port}, function (res) {
    var body;
    console.log('response status :', res.statusCode);
    res.on('data', function (data) {
      body = (body || '') + data;
    });
    res.on('end', function () {
      console.log('response body :', body);
      server.close(function(){
        console.log('server closed');
      });
    });
  });
  server.listen(port);
  console.log('server listening on port %s', port);
  client.end();
}

if (require.main === module) {
  run();
} else {
  exports = module.exports = run;
}
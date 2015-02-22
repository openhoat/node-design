## Server listening

Usual mistake :

```javascript
server.listen(port);
console.log('server listening on port %s', port);
```

Most of the time this code falls running... but you should think it will always fail !

Let's take an example :

- Start a HTTP server that serve a "hello world" content
- Do a HTTP request, and get the response
- After the response is received, close the server

Complete code : [server-listening-1-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/server-listening-1-bad-ok.js)

```javascript
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
```

Result :

```
$ node http-1-bad-ok.js
server listening on port 3000
response status : 200
response body : Hello World
server closed
```

### Why it should fail ?

To understand why it could fail, first think that the http listen function is asynchronous (this is also available for others modules, like express).

To show what it means, let's hack the listen function to make it "slower" and see the result :
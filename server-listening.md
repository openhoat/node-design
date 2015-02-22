## Server listening

Mistake that I see too often in many source codes :

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
```

Result :

```
$ node http-1-bad-ok
server listening on port 3000
response status : 200
response body : Hello World
server closed
```

### Why it should fail and why it does not ?

To understand why it could fail, first think that the http listen function is asynchronous (this is also available for others modules, like express).

To show what it means, let's hack the listen function to make it "slower" and see the result :

```javascript
hack.enable(net.Server.prototype, 'listen', function () {
  var that = this
    , args = arguments;
  setImmediate(function () {
    that.orig.apply(that, args);
  });
});
```

The [hack helper](https://github.com/openhoat/node-design/blob/master/lib/hack.js) allows you to override the specified function, in our case, we just want to do the same as the original listen function, but with a symbolic latency.

Now when you execute the same code, it fails :

```
$ node samples/server-listening-2-bad-ko
server listening on port 3000

events.js:72
        throw er; // Unhandled 'error' event
              ^
Error: connect ECONNREFUSED
    at errnoException (net.js:905:11)
    at Object.afterConnect [as oncomplete] (net.js:896:19)
```

When server.listen() is called, it returns before having bound the network, so the server is not really ready.

Another way to understand it is to go back to server-listening-1-bad-ok and run it with internal logs :

```
$ NODE_DEBUG="http net" node samples/server-listening-1-bad-ok
NET: 9614 listen2 0.0.0.0 3000 4 false
NET: 9614 _listen2: create a handle
NET: 9614 bind to 0.0.0.0
server listening on port 3000
NET: 9614 connect: find host localhost
HTTP: outgoing message end.
NET: 9614 onconnection
NET: 9614 _read
...
```

As you see, we are lucky because the binding is done before our log 'server listening...', but in the second case the binding hasn't finished when the request is received because we have slow down the listening job :

```
$ NODE_DEBUG="http net" node samples/server-listening-2-bad-ko
server listening on port 3000
NET: 9750 connect: find host localhost
HTTP: outgoing message end.
NET: 9750 listen2 0.0.0.0 3000 4 false
NET: 9750 _listen2: create a handle
NET: 9750 bind to 0.0.0.0
NET: 9750 afterConnect
NET: 9750 destroy
NET: 9750 close
NET: 9750 close handle
HTTP: HTTP SOCKET ERROR: connect ECONNREFUSED
Error: connect ECONNREFUSED
...
```

The proper way to manage it is to always handle a callback when the API provides one, as shown in [server-listening-3-good-ok](https://github.com/openhoat/node-design/blob/master/samples/server-listening-3-good-ok.js) :

```javascript
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
```

### To remember

- 'listen' function is asynchronous like most of IO operations, so provide a callback function and put your next operations into it
- This is also available for 'close'

### That's all!

But may be you're asking why 'var' declarations are always on top line... ? [See why](var-location.md)

Or go back to [table of contents](README.md)

Enjoy !
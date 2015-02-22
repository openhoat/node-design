'use strict';

var chai = require('chai')
  , server = require('./server')
  , logger = require('hw-logger')
  , Promise = require('bluebird')
  , request = require('request')
  , util = require('util')
  , requestAsync = Promise.promisify(request)
  , should = chai.should()
  , log = logger.log;

describe.only('server', function () {

  var port = 3001;

  before(function () {
    logger.setLevel('trace');
  });

  it('should start', function () {
    return server.start({
      port: port,
      routers: {
        routes: [{
          path: '/hello',
          middleware: function (req, res) {
            res.type('text').end('Hello World!');
          }
        }, {
          path: '/ping',
          middleware: function (req, res) {
            res.type('text').end('pong');
          }
        }, {
          path: '/error',
          middleware: function (/*req, res*/) {
            throw new Error('test');
          }
        }]
      }
    });
  });

  it('should get hello response', function () {
    return requestAsync(
      {
        method: 'GET',
        url: util.format('http://localhost:%s/%s', port, 'hello')
      })
      .spread(function (res, body) { // Use of spread to have 2 arguments instead of an array
        should.exist(res);
        res.should.have.property('statusCode', 200);
        res.headers.should.have.property('content-type', 'text/plain; charset=utf-8');
        should.exist(body);
        body.should.equal('Hello World!');
      });
  });

  it('should get ping response', function () {
    return requestAsync(
      {
        method: 'GET',
        url: util.format('http://localhost:%s/%s', port, 'ping')
      })
      .spread(function (res, body) {
        should.exist(res);
        res.should.have.property('statusCode', 200);
        res.headers.should.have.property('content-type', 'text/plain; charset=utf-8');
        should.exist(body);
        body.should.equal('pong');
      });
  });

  it('should get not found response', function () {
    return requestAsync(
      {
        method: 'GET',
        url: util.format('http://localhost:%s/%s', port, 'notfound')
      })
      .spread(function (res, body) {
        should.exist(res);
        res.should.have.property('statusCode', 404);
        res.headers.should.have.property('content-type', 'text/plain; charset=utf-8');
        should.exist(body);
        body.should.equal('resource not found');
      });
  });

  it('should get an error', function () {
    return requestAsync(
      {
        method: 'GET',
        url: util.format('http://localhost:%s/%s', port, 'error')
      })
      .spread(function (res, body) {
        should.exist(res);
        res.should.have.property('statusCode', 500);
        res.headers.should.have.property('content-type', 'text/plain; charset=utf-8');
        should.exist(body);
        body.should.equal('Error: test');
      });
  });

  it('should stop', function () {
    return server.stop();
  });

  it('should not respond after stopping server', function () {
    return requestAsync(
      {
        method: 'GET',
        url: util.format('http://localhost:%s', port)
      })
      .catch(function (err) {
        should.exist(err);
        err.should.have.property('code').that.equals('ECONNREFUSED');
      });
  });

});
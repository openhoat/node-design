'use strict';

var util = require('util')
  , _ = require('lodash')
  , Promise = require('bluebird')
  , express = require('express')
  , log = require('hw-logger').log
  , that, server;

that = {
  defaults: {
    port: 3000,
    host: 'localhost'
  },
  handleNotFound: function (req, res/*,next*/) {
    var formats = {
      text: function textPlain() {
        res.type('text').send('resource not found');
      },
      html: function () {
        res.send('<html><body><h3>resource not found</h3></body></html>');
      },
      json: function () {
        res.send({message: 'resource not found'});
      }
    };
    formats.default = formats.text;
    res.status(404).format(formats);
  },
  handleError: function (err, req, res, next) { // next is important (though useless) because express analyzes the function prototype to consider it as an error fallback handler
    var formats = {
      text: function textPlain() {
        res.send(err.toString());
      },
      html: function () {
        res.send(util.format('<html><body><h3>%s</h3></body></html>', err.toString()));
      },
      json: function () {
        res.send({error: err.toString()});
      }
    };
    formats.default = formats.text;
    log.error(err.stack);
    res.status(500).format(formats);
  },
  init: function (options) {
    var routers;
    that.config = _.extend({}, that.defaults, options);
    log.debug('options :', options);
    log.debug('defaults :', that.defaults);
    log.debug('config :', that.config);
    that.app = express();
    if (typeof that.config.routers === 'object') {
      routers = util.isArray(that.config.routers) ? that.config.routers : [that.config.routers];
      routers.forEach(function (routerConf) {
        var router = express.Router(routerConf.options)
          , routes = util.isArray(routerConf.routes) ? routerConf.routes : [routerConf.routes];
        routes.forEach(function (routeConf) {
          log.debug('routeConf :', routeConf);
          router[routeConf.method || 'get'](routeConf.path, routeConf.middleware);
        });
        that.app.use(routerConf.path || '/', router);
      });
    }
    that.app.use(that.handleNotFound);
    that.app.use(that.handleError);
    that.initialized = true;
  },
  start: function (options, cb) {
    if (typeof cb === 'undefined' && typeof options === 'function') {
      cb = options;
      options = null;
    }
    if (!that.initialized) {
      that.init(options);
    }
    return new Promise(
      function (resolve/*, reject*/) {
        that.server = that.app.listen(that.config.port, that.config.host, function () {
          log.info('server is listening on : %s:%s', that.config.host, that.config.port);
          resolve();
        });
      })
      .nodeify(cb);
  },
  stop: function (cb) {
    return new Promise(
      function (resolve/*,reject*/) {
        if (that.server) {
          that.server.close(function () {
            log.info('server is closed');
            resolve();
          });
        }
      })
      .nodeify(cb);
  }
};

server = {};
['init', 'start', 'stop'].forEach(function (key) {
  server[key] = that[key];
});

exports = module.exports = server;
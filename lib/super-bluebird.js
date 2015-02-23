'use strict';

var Promise = require('bluebird')
  , util = require('util')
  , log = require('hw-logger').log
  , cache = {}
  , that;

that = {
  promisifyRequire: function (modulePath) {
    if (!cache[modulePath]) {
      cache[modulePath] = that.promisify(require(modulePath));
    }
    return cache[modulePath];
  },
  promisify: function (o) {
    var promisified = {};
    Object.keys(o).forEach(function (key) {
      if (typeof o[key] === 'function') {
        promisified[key] = Promise.promisify(o[key]);
      } else {
        promisified[key] = function () {
          return o[key].apply(o, arguments);
        };
      }
    });
    return promisified;
  }
};

exports = module.exports = that;
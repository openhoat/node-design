'use strict';

var net = require('net')
  , hack = require('../lib/hack')
  , run = require('./http-1-bad-ok');

hack.enable(net.Server.prototype, 'listen', function () {
  var that = this
    , args = arguments;
  setImmediate(function () {
    that.orig.apply(that, args);
  });
});

if (require.main === module) {
  run();
} else {
  exports = module.exports = run;
}
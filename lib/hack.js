'use strict';

var that
  , origMap = {};

that = {
  enable: function (o, fnName, hackedFn) {
    origMap[o + '.' + fnName] = o[fnName];
    o[fnName] = (function (orig) {
      return function () {
        this.orig = orig;
        return hackedFn.apply(this, arguments);
      };
    })(origMap[o + '.' + fnName]);
  },
  disable: function (o, fnName) {
    o[fnName] = origMap[o + '.' + fnName];
  }
};

exports = module.exports = that;
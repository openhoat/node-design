'use strict';

var mod;

mod = {
  a: function () { // a is expected to stay private
    return 'private!';
  },
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return mod.a() + 'c';
  }
};

exports = module.exports = mod;
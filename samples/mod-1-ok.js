'use strict';

var mod;

mod = {
  a: function () { // a is expected to stay private
    return 'a';
  },
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return mod.a() + 'c';
  }
};

// Expose
exports = module.exports = {};
['b', 'c'].forEach(function (key) {
  exports[key] = mod[key];
});
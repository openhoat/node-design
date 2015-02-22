'use strict';

var mod;

function a() { // a is expected to stay private
  return 'private!';
}

mod = {
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return a() + 'c';
  }
};

exports = module.exports = mod;
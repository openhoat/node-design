'use strict';

var o;

function make() {
  var i = 1;
  return {
    get: function () {
      return i;
    },
    set: function () {
      i++;
    }
  };
}

o = make();
console.log(o.get());
o.set();
console.log(o.get());
'use strict';

var a = 7
  , b = 8
  , c;

console.log('a : %s, b : %s, c : %s', a, b, c);

c = 9;

(function scope1() {
  var i; // First line of scope#1
  // i begin of life
  console.log('i :', i);
  i = 1;
  console.log('i : %s', i);
  (function scope2() {
    var j; // First line of scope#2
    // j begin of life
    console.log('j : %s', j);
    for (j = 1; j <= 3; j++) {
      console.log('j :', j);
    }
    console.log('i : %s, j : %s', i, j);
    // j end of life
    console.log('a : %s, b : %s, c : %s', a, b, c);
  })();
  console.log('typeof j : %s', typeof j);
  // i end of life
  console.log('a : %s, b : %s, c : %s', a, b, c);
})();

console.log('a : %s, b : %s, c : %s', a, b, c);

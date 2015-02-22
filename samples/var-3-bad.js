'use strict';

console.log('typeof i : %s, typeof j : %s', typeof i, typeof j);
// console.log('i : %s, j : %s', i, j); // will fail if uncommented

(function () {
  // i and j begin of life
  console.log('i :', i);
  var i = 1;
  console.log('i : %s, j : %s', i, j);
  for (var j = 1; j <= 3; j++) {
    console.log('j :', j);
  }
  console.log('i : %s, j : %s', i, j);
  // i and j end of life
})();

console.log('typeof i : %s, typeof j : %s', typeof i, typeof j);
// console.log('i : %s, j : %s', i, j); // will fail if uncommented

'use strict';

(function () {
  // i begin of life
  console.log('i :', i);
  var i = 1;
  console.log('i : %s', i);
  (function () {
    // j begin of life
    console.log('j : %s', j);
    for (var j = 1; j <= 3; j++) {
      console.log('j :', j);
    }
    console.log('i : %s, j : %s', i, j);
    // j end of life
  })();
  console.log('typeof j : %s', typeof j);
  // i end of life
})();
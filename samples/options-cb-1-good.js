'use strict';

function fooAsync(a, b, cb) {
  cb(a + b);
}

fooAsync(2, 3, function (result) {
  console.log('result :', result);
});

fooAsync(2, function (result) {
  console.log('result :', result);
});
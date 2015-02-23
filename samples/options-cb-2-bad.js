'use strict';

function fooAsync(a, b, cb) {
  cb(a + b);
}

fooAsync(2, 3);
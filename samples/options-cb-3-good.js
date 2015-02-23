'use strict';

var Promise = require('bluebird')
  , _ = require('lodash');

function fooAsync(opt, cb) {
  var defaults = {c: 0}; // Default options values
  if (typeof cb === 'undefined' && typeof opt === 'function') { // opt is optional
    cb = opt;
    opt = null;
  }
  opt = _.extend({}, defaults, opt); // Compute effective options with defaults
  return new Promise( // Return a promise
    function (resolve/*, reject*/) {
      var result;
      if (typeof opt.a === 'undefined') { // a should be defined
        throw new Error('a not defined!'); // Exception is handled by promise
      }
      if (typeof opt.b === 'undefined') {
        throw new Error('b not defined!');
      }
      result = opt.a + opt.b;
      result = opt.a + opt.b;
      if (opt.c) {
        result += opt.c;
      }
      resolve(result);
    })
    .nodeify(cb); // Works also with callback
}

function handleResult(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('result :', result);
}

fooAsync({a: 2, b: 3}, handleResult); // normal use
fooAsync({a: 2, b: 3, c: 4}, handleResult); // added operand c
fooAsync({a: 2}, handleResult); // b missing
fooAsync(handleResult); // options missing
fooAsync(); // all missing
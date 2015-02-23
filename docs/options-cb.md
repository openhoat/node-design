the options callback idiom
==========================

In the lifecycle of a module, features will change (new ones, better ones) and the applied changes will probably need to update the arguments of some functions, an by the way there is a risk to break compatibility of your module.

In this example, we have an asynchronous function that give the sum of 2 numbers : [options-cb-1-good](https://github.com/openhoat/node-design/blob/master/samples/options-cb-1-good.js)

```javascript
function fooAsync(a, b, cb) {
  cb(a + b);
}
fooAsync(2, 3, function (result) {
  console.log('result :', result);
});
```

If we do not stricly respect the expected args, it will fail (example : no callback) : [options-cb-2-bad](https://github.com/openhoat/node-design/blob/master/samples/options-cb-2-bad.js)

```javascript
function fooAsync(a, b, cb) {
  cb(a + b);
}
fooAsync(2, 3);
```

```bash
$ node samples/options-cb-2-bad
TypeError: undefined is not a function
```

If we want to implement new features (like a third operand), it will break the arguments...

And if we want to use it in a promises chain, it will not fit...

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

Ok, let's resume, we want a function that :

1. understands what we mean even if some arguments are missing
2. returns the result by calling the provided callback, or returns a promise

The good way
------------

The best way to keep a clean design while keep an open door is to use the "options callback idiom" : [options-cb-3-good](https://github.com/openhoat/node-design/blob/master/samples/options-cb-3-good.js)

```javascript
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
```

Result :

```bash
$ node samples/options-cb-3-good
result : 5
result : 9
[Error: b not defined!]
[Error: a not defined!]
Unhandled rejection Error: a not defined!
```

![Oh yeah!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/yes-baby.jpg)

To remember
-----------

- when a function needs many arguments with some optionals and a callback, just use an options object and the callback
- almost everything can fit in it
- it's simple to use, and it's clear because the option keys are meanful
- it's easier to maintain

That's all!
-----------

go back to [table of contents](../README.md#use-cases)
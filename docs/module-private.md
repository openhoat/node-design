public/private in module
========================

When you write a node module, sometimes you don't want to expose all the functions, and prefer to keep some of them internal only.

Let's take an example : [mod1-bad](https://github.com/openhoat/node-design/blob/master/samples/mod1-bad.js)

```javascript
var mod;
mod = {
  a: function () { // a is expected to stay private
    return 'private!';
  },
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return mod.a() + 'c';
  }
};
exports = module.exports = mod;
```

Use this module in another : [mod2-bad](https://github.com/openhoat/node-design/blob/master/samples/mod2-bad.js)

```javascript
var mod = require('./mod-1-bad');
console.log('a :', mod.a());
console.log('b :', mod.b());
console.log('c :', mod.c());
```

Result :

```bash
$ node samples/mod2-bad
a : private!
b : b
c : private!c
```

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

As you noticed, the a function of mod if exposed.

The fix is simple, we just have to declare a function outside the exposed scope : [mod3-good](https://github.com/openhoat/node-design/blob/master/samples/mod3-good.js)

```javascript
var mod;
function a() { // a is expected to stay private
  return 'private!';
}
mod = {
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return a() + 'c'; // mod.a() has changed to a()
  }
};
exports = module.exports = mod;
```

And use it again : [mod4-good](https://github.com/openhoat/node-design/blob/master/samples/mod4-good.js)

```javascript
var mod = require('./mod-3-good');
console.log('typeof a :', typeof mod.a);
console.log('b :', mod.b());
console.log('c :', mod.c());
```

Result :

```bash
$ node samples/mod4-good
typeof a : undefined
b : b
c : private!c
```

Now a is no longer available, but c continues to use a.

But, to have it work, we had to change the code of c() and directly call a() instead of mod.a()...

The good way
------------

Let's see a more seamless solution : [mod5-good](https://github.com/openhoat/node-design/blob/master/samples/mod5-good.js)

```javascript
var mod;
mod = {
  a: function () { // a is expected to stay private
    return 'private!';
  },
  b: function () { // b is expected to be public
    return 'b';
  },
  c: function () { // c is expected to be public and uses a private function
    return mod.a() + 'c'; // mod.a() stay unchanged
  }
};
// Expose
exports = module.exports = {};
['b', 'c'].forEach(function (key) {
  exports[key] = mod[key];
});
```
Use it : [mod6-good](https://github.com/openhoat/node-design/blob/master/samples/mod6-good.js)

```javascript
var mod = require('./mod-5-good');
console.log('typeof a :', typeof mod.a);
console.log('b :', mod.b());
console.log('c :', mod.c());
```

Result :

```bash
$ node samples/mod6-good
typeof a : undefined
b : b
c : private!c
```

![Oh yeah!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/yes-baby.jpg)

Later, if you need to create a new function in the module and to expose it, simply add it to the array ['b', 'c'].

To remember
-----------

- don't use '+' with console.log, instead use ',' to pass each argument
- the first string argument can help you to specify the format

That's all!
-----------

go back to [table of contents](../README.md#use-cases)
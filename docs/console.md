Treat console.log as your friend
================================

When you wanna log something, you usually consider console.log : [console-1-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/console-1-bad-ok.js)

```javascript
var a = 3;
console.log('a : ' + a);
```

Result :

```
$ node samples/console-1-bad-ok
a : 3
```

But what if the log subject is an object : [console-2-bad-ko](https://github.com/openhoat/node-design/blob/master/samples/console-2-bad-ko.js)

```javascript
var a = {b: 3};
console.log('a : ' + a);
```

Result :

```
$ node samples/console-2-bad-ko
a : [object Object]
```

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

Oops... It's not exactly what we expected...

The reason why the result is stupid
-----------------------------------

We called console.log with only one argument that is a concatenation between one string ('a : ') and one object that is converted to a string (toString() is called under the hood).

The stupidness here is not in console.log, but in the way we call it.

console.log can do it better, because it supports any number of arguments, so use it.

The good way
------------

Here's a good example of using console.log with several arguments, and a format string : [console-3-good-ok](https://github.com/openhoat/node-design/blob/master/samples/console-3-good-ok.js)

```javascript
var a = {b: 3}
  , b = 4;
console.log('a :', a);
console.log('a : %j, b : %s', a, b);
console.log('values :', a, b);
```

Result :

```
$ node samples/console-3-good-ok
a : { b: 3 }
a : {"b":3}, b : 4
values : { b: 3 } 4
```

![Oh yeah!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/yes-baby.jpg)

More informaton about [format used by console.log](http://nodejs.org/api/util.html#util_util_format_format)

To remember
-----------

- don't use '+' with console.log, instead use ',' to pass each argument
- the first string argument can help you to specify the format

That's all!
-----------

Suggested stories :

- asking yourself why ['var' declarations are always on top line](var.md)
- go back to [table of contents](../README.md#use-cases)

Enjoy !
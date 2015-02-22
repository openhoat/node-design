## Var keyword good place

Sure you have already seen this kind of code, and probably find it good : [var-1-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/var-1-bad-ok.js)

```javascript
var i = 1;
console.log('i :', i);
for (var j = 1; j <= 3; j++) {
  console.log('j :', j);
}
```

Result :

```
$ node samples/var-1-bad-ok
i : 1
j : 1
j : 2
j : 3
```

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

This form of source code let people guess that variables scopes begin at the place of the keyword 'var'.

Let's see what is the truth : [var-2-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/var-2-bad-ok.js)

```javascript
console.log('i :', i);
var i = 1;
console.log('i :', i);
console.log('j :', j);
for (var j = 1; j <= 3; j++) {
  console.log('j :', j);
}
```

Result :

```
$ node samples/var-2-bad-ok
i : undefined
i : 1
j : undefined
j : 1
j : 2
j : 3
```

Oops... It seems that i and j are effectively declared (despite they are not defined) before var keywords locations...

In fact, the rule is simple : the visibility of variables is defined by their nearest outer scope, and a scope is usually defined by 'function' keyword.

See it in this example : [var-3-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/var-3-bad-ok.js)

```javascript
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
```

Result :

```
$ node samples/var-3-bad-ok
typeof i : undefined, typeof j : undefined
i : undefined
i : 1, j : undefined
j : 1
j : 2
j : 3
i : 1, j : 4
typeof i : undefined, typeof j : undefined
```

As you noticed, j continues its life after the for loop with a value of 4, so contrary to popular belief the scope is not the for loop...

Example of nested scopes : [var-4-bad-ok](https://github.com/openhoat/node-design/blob/master/samples/var-4-bad-ok.js)

```javascript
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
```

Result :

```
$ node samples/var-4-bad-ok
i : undefined
i : 1
j : undefined
j : 1
j : 2
j : 3
i : 1, j : 4
typeof j : undefined
```

### The good practice to avoid confusing

![Oh yeah!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/yes-baby.jpg)

Example of well formed source code : [var-5-good-ok](https://github.com/openhoat/node-design/blob/master/samples/var-5-good-ok.js)

```javascript
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
```

Result :

```
$ node samples/var-5-bad-ok
a : 7, b : 8, c : undefined
i : undefined
i : 1
j : undefined
j : 1
j : 2
j : 3
i : 1, j : 4
a : 7, b : 8, c : 9
typeof j : undefined
a : 7, b : 8, c : 9
a : 7, b : 8, c : 9
```

### To remember

- definition and declaration are not the same concept, while definition is explicite, declaration is done under the hood despite the "var" keyword location
- except if you perfectly know what you do, you should always place all "var" declarations at the very first top line of the current scope (function), even if you only need to define it later

### That's all!

Suggested stories :

- asking yourself why ['var' declarations are always on top line](var-location.md)
- how to definitely deal with [callback hell](callback-hell.md)
- go back to [table of contents](README.md#use-cases)

Enjoy !
definitely kill the callback hell
=================================

When the goal is simple, callbacks are simple.

Read a directory : [callback-hell-1-good](https://github.com/openhoat/node-design/blob/master/samples/callback-hell-1-good.js)

```javascript
var path = require('path')
  , fs = require('fs');
fs.readdir(path.join(__dirname, '..'), function (err, files) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('files :', files);
});
```

Result :

```bash
$ node samples/callback-hell-1-good
files : [ '.git',
  '.gitignore',
  '.idea',
  'Gruntfile.js',
  'LICENSE',
  'README.md',
  'assets',
  'dist',
  'docs',
  'jshint.json',
  'lib',
  'node_modules',
  'package.json',
  'samples',
  'spec' ]
```

But if the goal is to create a function that gets only the files in a directory, it becomes more complicated because we need to get stat of each file to check wether it's a directory or not.

Get only files in directory : [callback-hell-2-bad](https://github.com/openhoat/node-design/blob/master/samples/callback-hell-2-bad.js)

```javascript
function getDirFiles(baseDir, cb) {
  fs.readdir(baseDir, function (err, files) {
    var result, getStat;
    if (err) {
      cb(err);
      return;
    }
    result = [];
    getStat = function (i) { // need to create an iterator function because a basic loop does not fit asynchronous world
      var filename, file;
      i = i || 0;
      filename = files[i];
      file = path.join(baseDir, filename);
      fs.lstat(file, function (err, stat) {
        if (err) { // error handling repeated twice!
          cb(err);
          return;
        }
        if (!(stat.isDirectory())) { // if it's not a directory add it to result
          result.push(filename);
        }
        if (i === files.length - 1) { // when the end is reached, it provides the result to callback
          cb(null, result);
        } else {
          getStat(++i); // else iterate over next item
        }
      });
    };
    getStat(); // go for the 1st iteration
  });
}

getDirFiles(path.join(__dirname, '..'), function (err, files) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('files :', files);
});
```

Result :

```bash
$ node samples/callback-hell-2-bad.js
files : [ '.gitignore',
  'Gruntfile.js',
  'LICENSE',
  'README.md',
  'jshint.json',
  'package.json' ]
```

Ok, it works, but it's loud and complicated, too complicated for a so simple need...

![Oh no!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/oh-no.jpg)

This is the very beginning of callback hell (look at the number of '{').

To fight against this hell, you have the choice to : code yourself some helpers, use some modules like async, step, Q, or bluebird.

I recommend to use [bluebird](https://github.com/petkaantonov/bluebird), the most mature and powerful promise implementation.

The good way
------------

Now let's see how to refactor the function with bluebird : [callback-hell-3-good](https://github.com/openhoat/node-design/blob/master/samples/callback-hell-3-good.js)

```javascript
function getDirFiles(baseDir) {
  return fs
    .readdirAsync(baseDir)
    .map(function (filename) { // Transform the file array to an array that contains filename for files, and false for directories
      var file = path.join(baseDir, filename);
      return fs
        .lstatAsync(file)
        .then(function (stat) {
          return !stat.isDirectory() && filename;
        });
    })
    .filter(Boolean); // Remove the 'false' items
}

getDirFiles(path.join(__dirname, '..'))
  .then(function (files) {
    console.log('files :', files);
  })
  .catch(function (err) { // One place to handle all errors
    console.error(err);
  });
```

Result :

```bash
$ node samples/callback-hell-3-good.js
files : [ '.gitignore',
  'Gruntfile.js',
  'LICENSE',
  'README.md',
  'jshint.json',
  'package.json' ]
```

But there is a counterpart in the way we use our getDirFiles, the consuming code has to use promise methods, so it's not seamless.

Fortunately, bluebird has a solution to allow both of promise and usual callback mode : [callback-hell-4-good](https://github.com/openhoat/node-design/blob/master/samples/callback-hell-4-good.js)

![Oh yeah!](https://raw.githubusercontent.com/openhoat/node-design/master/assets/yes-baby.jpg)

```javascript
function getDirFiles(baseDir, cb) { // optional callback : the caller decides
  return fs
    .readdirAsync(baseDir)
    .map(function (filename) {
      var file = path.join(baseDir, filename);
      return fs
        .lstatAsync(file)
        .then(function (stat) {
          return !stat.isDirectory() && filename;
        });
    })
    .filter(Boolean)
    .nodeify(cb); // Magic!
}

getDirFiles(path.join(__dirname, '..'), function (err, files) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('files :', files);
});
```

The other good news : the promise version does not decrease performance as shown in [callback-hell-5-bench](https://github.com/openhoat/node-design/blob/master/samples/callback-hell-5-bench.js)

```bash
$ node samples/callback-hell-5-bench
...
bench #0 : 1845ms, #1 : 1555ms

```

To remember
-----------

- you should seriously consider using promises when you're doing a lot of asynchronous code
- bluebird is a wonderful promise implementation
- promises, when well used, do not decrease performances (and sometimes increase them)
- for simple callbacks, promises are usually overkill because the initial code is already easy to read
- use nodeify in your APIs to let the client code seamlessly choose between promise and callback

That's all!
-----------

go back to [table of contents](../README.md#use-cases)
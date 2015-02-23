'use strict';

var path = require('path')
  , fs = require('fs');

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
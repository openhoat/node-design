'use strict';

var Promise = require('bluebird')
  , path = require('path')
  , measure = require('measure')
  , fs = Promise.promisifyAll(require('fs'))
  , getDirFiles;

getDirFiles = [
  function (baseDir, cb) {
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
  },
  function (baseDir, cb) { // optional callback : the caller decides
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
];

function bench(index, count, cb) {
  var measureDone, i, iterate;
  measureDone = measure.measure('timeconsumingoperation');
  i = 0;
  iterate = function () {
    getDirFiles[index](path.join(__dirname, '..'), function (err, files) {
      if (err) {
        console.error(err);
      } else {
        console.log('files :', files);
      }
      if (i < count - 1) {
        i++;
        iterate();
      } else {
        cb(measureDone());
      }
    });
  };
  iterate();
}

bench(0, 5000, function (duration) {
  var durations = [duration];
  bench(1, 5000, function (duration) {
    durations.push(duration);
    console.log('bench #0 : %sms, #1 : %sms', durations[0], durations[1]);
  });
});

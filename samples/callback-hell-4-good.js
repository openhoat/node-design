'use strict';

var Promise = require('bluebird')
  , path = require('path')
  , fs = Promise.promisifyAll(require('fs'));

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
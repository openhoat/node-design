'use strict';

var Promise = require('bluebird')
  , path = require('path')
  , fs = Promise.promisifyAll(require('fs'));

function getDirFiles(baseDir) {
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
    .filter(Boolean);
}

getDirFiles(path.join(__dirname, '..'))
  .then(function (files) {
    console.log('files :', files);
  })
  .catch(function (err) {
    console.error(err);
  });
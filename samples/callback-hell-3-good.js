'use strict';

var Promise = require('bluebird')
  , path = require('path')
  , fs = Promise.promisifyAll(require('fs'));

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
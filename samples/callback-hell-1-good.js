'use strict';

var path = require('path')
  , fs = require('fs');

fs.readdir(path.join(__dirname, '..'), function (err, files) {
  if (err) {
    console.error(err);
    return;
  }
  console.log('files :', files);
});
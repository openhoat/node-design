'use strict';

var chai = require('chai')
  , path = require('path')
  , fs = require('fs')
  , Promise = require('bluebird')
  , measure = require('measure')
  , logger = require('hw-logger')
  , log = logger.log
  , should = chai.should();

describe('test suite', function () {

  var measureDone;

  before(function () {
    logger.setLevel('trace');
  });

  beforeEach(function () {
    measureDone = measure.measure('timeconsumingoperation');
  });

  afterEach(function () {
    var duration = measureDone();
    log.trace('%s took : %sms', this.currentTest.title, duration);
  });

  describe('read files', function () {

    var baseDir = path.join(__dirname, '..');

    before(function () {
      Promise.promisifyAll(fs);
    });

    it('#1 should return all files', function (done) {
      fs.readdir(baseDir, function (err, files) {
        should.not.exist(err);
        log.debug('files :', files);
        files.should.be.an('array').that.is.not.empty();
        files.should.have.length.above(10);
        done();
      });
    });

    it('#2 should return all files that are not directories', function (done) {
      var result = [];
      fs.readdir(baseDir, function (err, files) {
        should.not.exist(err);
        log.debug('files :', files);
        files.should.be.an('array').that.is.not.empty();
        files.forEach(function (file, index) {
          fs.lstat(path.join(baseDir, file), function (err, stat) {
            should.not.exist(err);
            if (!stat.isDirectory()) {
              result.push(file);
            }
            if (index === files.length - 1) {
              log.debug('files :', result);
              result.should.not.be.empty();
              result.should.have.lengthOf(8);
              done();
            }
          });
        });
      });
    });

    it('#3 should return all files that are not directories with bluebird', function (done) {
      fs.readdirAsync(baseDir)
        .then(function (files) {
          files.should.be.an('array').that.is.not.empty();
          Promise.all(
            files.map(function (file) {
              return fs.lstatAsync(path.join(baseDir, file))
                .then(function (stat) {
                  return stat.isDirectory() ? null : file;
                });
            }))
            .then(function (files) {
              return files.filter(Boolean);
            })
            .then(function (files) {
              log.debug('files :', files);
              files.should.be.an('array').that.is.not.be.empty();
              files.should.have.lengthOf(8);
            });
        })
        .then(done) // If everything is ok then end with done
        .catch(done); // If an error then pass it to done
      // same as :
      // .then(done, done);
    });

    it('#4 should return all files that are not directories with bluebird', function (/*done*/) { // Don't specify any done callback
      // Returns the promise instead of calling done ((mocha is able to understand any promise and handle errors)
      return fs.readdirAsync(baseDir) // Read dir
        .then(function (files) {
          files.should.be.an('array').that.is.not.empty();
          return Promise.all( // Return an array of promises
            files.map(function (file) {
              return fs.lstatAsync(path.join(baseDir, file)) // Get file stat
                .then(function (stat) {
                  return stat.isDirectory() ? null : file; // Return file if not a directory
                });
            }));
        })
        .call('filter', Boolean) // Remove null files in array
        .then(function (files) {
          log.debug('files :', files);
          files.should.be.an('array').that.is.not.be.empty();
          files.should.have.lengthOf(8);
        });
    });

    // Most efficient solution
    it('#5 should return all files that are not directories with bluebird', function (/*done*/) { // Don't specify any done callback
      // Returns the promise instead of calling done ((mocha is able to understand any promise and handle errors)
      return fs.readdirAsync(baseDir) // Read dir
        .then(function (files) {
          files.should.be.an('array').that.is.not.empty();
          return Promise.map(files, function (file) {
            return fs.lstatAsync(path.join(baseDir, file)) // Get file stat
              .then(function (stat) {
                return stat.isDirectory() ? null : file; // Return file if not a directory
              });
          });
        })
        .call('filter', Boolean) // Remove null files in array
        .then(function (files) {
          log.debug('files :', files);
          files.should.be.an('array').that.is.not.be.empty();
          files.should.have.lengthOf(8);
        });
    });

    it('#6 should return all files that are not directories with bluebird', function (/*done*/) { // Don't specify any done callback
      // Returns the promise instead of calling done ((mocha is able to understand any promise and handle errors)
      return fs.readdirAsync(baseDir) // Read dir
        .then(function (files) {
          files.should.be.an('array').that.is.not.empty();
          return Promise.reduce(files, function (total, file) { // Use reduce to populate a result array with files that are not directory
            return fs.lstatAsync(path.join(baseDir, file)) // Get file stat
              .then(function (stat) {
                if (!stat.isDirectory()) { // Push file in accumulator if not a directory
                  total.push(file);
                }
                return total;
              });
          }, []); // Initial value is an empty array
        }) // no need to apply a post-filter
        .then(function (files) {
          log.debug('files :', files);
          files.should.be.an('array').that.is.not.be.empty();
          files.should.have.lengthOf(8);
        });
    });

  });

});
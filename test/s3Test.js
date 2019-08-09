'use strict';

var assert = require('assert');
var s3Dao = require("../daos/s3QuoterDao.js");

describe('Test S3 DataBase', function() {
  
    describe('check crud function', function() {

      it('send data to s3', function() {
            s3Dao.sendQuotesToS3('./data/segdeg.json', 'testfolder/segdeg.json');
      });

      it('get data from s3', function() {
            s3Dao.getQuotesFromS3('testfolder/segdeg.json', './data/testdata.json');
      });

    });
  
});
'use strict';

var assert = require('assert');
var s3Dao = require("../daos/s3QuoterDao.js");

describe('Test S3 DataBase', function () {

      describe('check crud function', function () {

            it('send data to s3', function () {
                  var payload = { "1": "Jetzt homman, Burschen!", 
                                    "2": "SEEEEEGGGGG!", 
                                    "3": "I have a shirt with your name, man!", 
                                    "4": "Seg! Seg! Segidideg!" 
                              };
                  s3Dao.sendQuotesFileToS3('testfolder/segdeg.json', payload);
            });

            it('get data from s3', async function () {
                  s3Dao.getQuotesFileFromS3('testfolder/segdeg.json')
                        .catch(function (data) { console.log(data) })
                        .then(function (err) { console.log(err) });
            });

      });

});
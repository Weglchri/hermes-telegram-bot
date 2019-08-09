var knox = require('knox-s3');
const aws = require('aws-sdk');
var bodyParser = require('body-parser');
var utils = require("../lib/utils.js");
const fs = require('fs');
const { StringDecoder } = require('string_decoder');




const SOURCE_QUOTE_FILE = './data/segdeg.json';
const TARGET_QUOTE_FILE= 'testfolder/segdeg.json';

// database connection settings
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'hermes-telegram-storage';
const AWS_API_KEY = process.env.AWSAccessKeyId;
const AWS_SECRET_KEY = process.env.AWSSecretKey;
const AMAZONS3 = 'http://s3.amazonaws.com/' + S3_BUCKET_NAME;


aws.config.update({
  accessKeyId: 'AKIAIJIF2B4KG56XSKGA',
  secretAccessKey: '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'
});

// aws.config.update({
//   accessKeyId: AWS_API_KEY,
//   secretAccessKey: AWS_SECRET_KEY
// });

var s3 = new aws.S3();

module.exports = {

  getQuotesFromS3: function (s3FilePath, writeFilePath) {
    var params = {
      Bucket: S3_BUCKET_NAME,
      Key : s3FilePath
    };
    s3.getObject(params, (err, data) => {
        if (err) console.error(err);
        utils.writeFile(writeFilePath, data.Body.toString());
        console.log(`Saved File Successfully at ${writeFilePath}`);
    });
  },

  sendQuotesToS3: function(localFilePath, s3FilePath) {
    var file = utils.readFileAsString(localFilePath);
    var base64data = new Buffer.from(file);
    var params = {
      Bucket: S3_BUCKET_NAME,
      Key: s3FilePath,
      Body: base64data
    };
    s3.upload(params, (err, data) => {
      if (err) console.error(`Upload Error ${err}`);
      console.log(`Upload Completed to ${s3FilePath}`);
    });
  }

}

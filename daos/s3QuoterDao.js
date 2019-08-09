const aws = require('aws-sdk');

// database connection settings
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || 'hermes-telegram-storage';
const AWS_API_KEY = process.env.AWSAccessKeyId;
const AWS_SECRET_KEY = process.env.AWSSecretKey;
const AMAZONS3 = 'http://s3.amazonaws.com/' + S3_BUCKET_NAME;

aws.config.update({
  accessKeyId: AWS_API_KEY,
  secretAccessKey: AWS_SECRET_KEY
});

var s3 = new aws.S3();

module.exports = {

  getQuotesFileFromS3 : function(s3FilePath) {
    return new Promise((resolve, reject) => {
      var params = {
        Bucket: S3_BUCKET_NAME,
        Key : s3FilePath
      };
      s3.getObject(params, (err, data) => { 
        if (err) console.error(`Download Error: ${err}`);
        resolve(data.Body.toString()); 
        reject(err); 
      });
    })
  },

  sendQuotesFileToS3 : async function(s3FilePath, payload) {
    return new Promise((resolve, reject) => {
      var jsonPayload = JSON.stringify(payload);
      var base64data = new Buffer.from(jsonPayload);
      var params = {
        Bucket: S3_BUCKET_NAME,
        Key: s3FilePath,
        Body: base64data
      };
      s3.upload(params, (err, data) => {
        if (err) console.error(`Upload Error: ${err}`);
        resolve(data);
        reject(err);
      });
    })
  }
}

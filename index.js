'use strict';
var express = require('express');
var app = express();
var axios = require('axios');
var knox = require('knox-s3');
var bodyParser = require('body-parser');

// model
var quoter = require("./models/quoter.js");
// dao
var s3database = require("./dao/s3-quoter-dao.js");

// add enhanced logging for better traceability of issues!

// heroku conenction settings
const APP_URL = 'https://api.telegram.org/bot';
const HEROKU_URL = process.env.URL;
const APITOKEN = process.env.TOKEN;
const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

// database connection settings
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME
const AWS_API_KEY = process.env.AWSAccessKeyId;
const AWS_SECRET_KEY = process.env.AWSSecretKey;
const AMAZONS3 = 'http://s3.amazonaws.com/' + S3_BUCKET_NAME;

// Commandlist 
/*

greetings - hermes greets you 💋
quote - get the finest quotes of all time
tell - send me a quote

*/

// Telegram message functions 
function sentMessages(req, res, reqtyp, txsend) {
    axios.post(`${APP_URL}${APITOKEN}/sendMessage`,
    {
         chat_id: reqtyp.chat.id,
         text: txsend
    })
    .then((response) => { 
         res.status(200).send(response);
    }).catch((error) => {
         res.send(error);
    });
}


// Router Actions
app.use(bodyParser.json());

// Endpoints
app.post('/', (req, res) => {
   
     // res.status(200).send({});
     console.log("Request Body: ", req.body);
     
     const requestMessageType = req.body.message || req.body.edited_message;
     // check for a text request
     const sentMessage = requestMessageType.text || 'empty';
     // use actions on request
     const user = requestMessageType.from.username || req.body.message.from.first_name;
     const userId = requestMessageType.from.id;
     const chatId = requestMessageType.chat.id;
     const listedPerson = quoter.getPersonQuoteList().includes(userId);
     
     console.log("Text to process: ", sentMessage);
     console.log("Listed persons: ", quoter.getPersonQuoteList());
     console.log("Requested Person listed: ", listedPerson);

     var client = knox.createClient({
          key: AWS_API_KEY,
          secret: AWS_SECRET_KEY,
          bucket: S3_BUCKET_NAME
     });

     client.get('/testfolder/segdeg.json').on('response', function(res){
          console.log(res.statusCode);
          console.log(res.headers);
          res.setEncoding('utf8');
          res.on('data', function(chunk){
               console.log("S3 Output");
               console.log(JSON.parse(chunk));
          });
     }).end();

     //https://hermes-telegram-storage.s3.eu-central-1.amazonaws.com/testfolder/segdeg.json
     //https://hermes-telegram-storage.s3.eu-central-1.amazonaws.com/testfolder/segdeg.json
     
     // Hermes Router
     if (sentMessage.match(/greetings/igm)) {
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, requestMessageType, textToSend);
         
     } else if (sentMessage.match(/tell/igm)) {
          console.log("Entered: Tell listed");
          console.log("Add person's quote");
          //const textToSend = `Send me first a quote i should add, ${user} 🏹`;
          
          const newQuote = quoter.getQuoteFromMessage(sentMessage);
          const quoteNumber = quoter.addQuoteToFile(newQuote);
          const textToSend = `Successfully added your quote, ${user} ❤️ \n Quote ${quoteNumber} : ${newQuote}`;
          
          sentMessages(req, res, requestMessageType, textToSend); 
              
     // } else if (sentMessage.match(/tell/igm) && !listedPerson) {
     //      console.log("Entered: Tell unlisted");
     //      const textToSend = `Send me a quote i should know, ${user} ⚜️`;
     //      quoter.addPersonToPersonQuoteList(userId);
     //      sentMessages(req, res, requestMessageType, textToSend); 
     
     // } else if (sentMessage.match(/exit/igm) && listedPerson) {
     //      console.log("Entered: Exit");
     //      quoter.removePersonQuoteList(userId);
     //      const textToSend = `Aborted, no quote added 🙁`;
     //      sentMessages(req, res, requestMessageType, textToSend); 

     // } else if (listedPerson) {
     //      console.log("Add person's quote");
     //      const quoteNumber = quoter.addQuoteToFile(sentMessage);
     //      quoter.removePersonQuoteList(userId);
     //      const textToSend = `Successfully added your quote, ${user} ❤️ \n 
     //           Quote ${quoteNumber} : ${sentMessage}`;
     //      sentMessages(req, res, requestMessageType, textToSend);

     } else if (sentMessage.match(/quote/igm)) {
          const textToSend = quoter.askForQuote(sentMessage);
          sentMessages(req, res, requestMessageType, textToSend); 

     } else {
          console.log("Send response: 200");
          res.status(200).send({});
   }
});

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});

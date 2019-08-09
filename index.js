'use strict';
var express = require('express');
var app = express();
var axios = require('axios');
var bodyParser = require('body-parser');

// model
var quoter = require("./models/quoter.js");

// add enhanced logging for better traceability of issues!

// heroku conenction settings
const HEROKU_URL = process.env.URL;
const APITOKEN = process.env.TOKEN;
const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;
const APP_URL = 'https://api.telegram.org/bot';


async function init() {
     await quoter.executeQuoteFileUpdate();
     console.log("Init successfull");
}; await init();

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
app.post('/', async (req, res) => {
   
     // res.status(200).send({});
     console.log("Request Body: ", req.body);
    
     const requestMessageType = req.body.message || req.body.edited_message;
     // check for a text request
     const sentMessage = requestMessageType.text || 'empty';
     // use actions on request
     const user = requestMessageType.from.username || req.body.message.from.first_name;
     const userId = requestMessageType.from.id;
     const chatId = requestMessageType.chat.id;
     
     console.log("Text to process: ", sentMessage);

     // Hermes Router
     if (sentMessage.match(/greetings/igm)) {
          console.log(`${user} entered greetings`);
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, requestMessageType, textToSend);
         
     } else if (sentMessage.match(/tell/igm)) {
          console.log(`${user} entered tell`);
          
          const quote = quoter.getQuoteFromMessage(sentMessage);
          const quoteNumber = await quoter.addQuoteToFile(quote);
          if(quote === undefined) {
               const textToSend = `Nothing to add, ${user} 🏹`;
          } else {
               const textToSend = `Successfully added your quote, ${user} ❤️ \n  Quote ${quoteNumber} : ${quote}`;
          }
          sentMessages(req, res, requestMessageType, textToSend); 

     } else if (sentMessage.match(/remove/igm)) {
          console.log(`${user} entered remove`);
          
          // check if number exists
          // do actions
          // var quoteNumber = quoter.removeQuoteFromFile();
          // var quote = quoter.getQuote(quoteNumber);
          
          // const textToSend = `Successfully removed your quote, ${user} \n 
          //      Quote ${quoteNumber} : ${quote}`;
          // sentMessages(req, res, requestMessageType, textToSend); 

     } else if (sentMessage.match(/quote/igm)) {
          
          const textToSend = await quoter.askForQuote(sentMessage);
          sentMessages(req, res, requestMessageType, textToSend); 

          // quoter.askForQuote(sentMessage)
          // .then(function(textToSend) {
          //      sentMessages(req, res, requestMessageType, textToSend); 
          // }).catch((err) => {console.log(err)});

     } else {
          console.log("Send response: 200");
          res.status(200).send({});
   }
});

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});

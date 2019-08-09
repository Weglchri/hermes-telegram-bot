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
     console.log("init successful");
}; 
init();

// Commandlist 
/*

greetings - hermes greets you 💋
list - get all quotes available
quote - get the finest quotes of all time ⚜️
tell - send me a quote 

*/

// Telegram message functions 
function sentMessages(req, res, txsend, reqId) {
    axios.post(`${APP_URL}${APITOKEN}/sendMessage`,
    {
         chat_id: reqId || req.body.message.chat.id,
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
   
     if(req.body.message.text == undefined) {
          res.status(200).send({});
     }
     
     console.log("Request Body: ", req.body);
     //const requestMessageType = req.body.message || req.body.edited_message;
     // check for a text request
     const sentMessage = req.body.message.text || 'empty';
     // use actions on request
     const user = req.body.message.from.username || req.body.message.from.first_name;
     const userId = req.body.message.from.id;
     //const chatId = req.body.message.chat.id;
     
     console.log("text to process: ", sentMessage);

     // Hermes Router
     if (sentMessage.match(/greetings/igm)) {
          console.log(`${user} entered greetings`);
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, textToSend);
         
     } else if (sentMessage.match(/tell/igm)) {
          console.log(`${user} entered tell`);
          
          var textToSend = null;
          const quote = quoter.getQuoteFromMessage(sentMessage);
          if(quote) {
               const quoteNumber = await quoter.addQuoteToFile(quote);
               textToSend = `Successfully added your quote, ${user} ❤️ \n  Quote ${quoteNumber} : ${quote}`;
          } else {
               textToSend = `Write /tell with your quote!, ${user} 🏹`;
          }
          sentMessages(req, res, textToSend); 

     } else if (sentMessage.match(/remove/igm)) {
          console.log(`${user} entered remove`);
          
          // check if number exists
          // do actions
          // var quoteNumber = quoter.removeQuoteFromFile();
          // var quote = quoter.getQuote(quoteNumber);
          
          // const textToSend = `Successfully removed your quote, ${user} \n 
          //      Quote ${quoteNumber} : ${quote}`;
          // sentMessages(req, res, requestMessageType, textToSend); 

     } else if (sentMessage.match(/list/igm)) {
          const textToSend = await quoter.getQuotesObject();
          sentMessages(req, res, textToSend, userId); 

     } else if (sentMessage.match(/quote/igm)) {
          const textToSend = await quoter.askForQuote(sentMessage);
          sentMessages(req, res, textToSend); 

     } else {
          console.log("Send response: 200");
          res.status(200).send({});
   }
});

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});

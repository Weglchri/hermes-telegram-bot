'use strict';
var express = require('express');
var app = express();
// add enhanced logging for better traceability of issues!

const bodyParser = require('body-parser');
const axios = require('axios');

var quoter = require("./models/quoter.js");

const APP_URL = 'https://api.telegram.org/bot';
const HEROKU_URL = process.env.URL;
const APITOKEN = process.env.TOKEN;
const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

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

     // Hermes Router
     if (sentMessage.match(/greetings/igm)) {
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, requestMessageType, textToSend);
     
     } else if (sentMessage.match(/quote/igm)) {
          const textToSend = quoter.askForQuote(sentMessage);
          sentMessages(req, res, requestMessageType, textToSend); 
       
     } else if (sentMessage.match(/tell/igm) && listedPerson) {
          console.log("Entered: Tell listed");
          const textToSend = `Send me first a quote i should add, ${user} 🏹`;
          sentMessages(req, res, requestMessageType, textToSend); 
              
     } else if (sentMessage.match(/tell/igm) && !listedPerson) {
          console.log("Entered: Tell unlisted");
          const textToSend = `Send me a quote i should know, ${user} ⚜️`;
          quoter.addPersonToPersonQuoteList(userId);
          sentMessages(req, res, requestMessageType, textToSend); 
     
     } else if (sentMessage.match(/exit/igm) && listedPerson) {
          console.log("Entered: Exit");
          quoter.removePersonQuoteList(userId);
          const textToSend = `Aborted, no quote added 🙁`;
          sentMessages(req, res, requestMessageType, textToSend); 

     } else if (listedPerson) {
          console.log("Add person's quote");
          const quoteNumber = quoter.addQuoteToFile(sentMessage);
          quoter.removePersonQuoteList(userId);
          const textToSend = `Successfully added your quote, ${user} ❤️ \n 
               Quote ${quoteNumber} : ${sentMessage}`;
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

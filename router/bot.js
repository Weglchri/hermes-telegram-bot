'use strict';
var express = require('express');
var app = express();
var axios = require('axios');
var bodyParser = require('body-parser');

// router
var tellRouter = require("./tell.js");

// models
var quoter = require("../models/quoter.js");
var storyteller = require("../models/storyteller.js");

// heroku connection settings
const HEROKU_URL = process.env.URL;
const APITOKEN = process.env.TOKEN;
const MODE = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;
const APP_URL = 'https://api.telegram.org/bot';

async function init() {
     await quoter.executeApprovedQuoteFileUpdate();
     await quoter.executePendingQuoteFileUpdate();
     console.log("init successful");
};
init();

// commandlist 
/*

quote - get the finest quotes of all time ⚜️
list - get all quotes available
tell - send me a quote 

*/

// telegram message functions 
module.exports.sentMessages = function (req, res, txsend, reqId) {
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

// router actions
app.use(bodyParser.json());

app.post('/', async (req, res) => {

     // console.log("Request Body: ", req.body);

     // global variables
     var sentMessage = 'empty';
     var user = 'empty';
     var userId = 'empty';
     var fullName = 'empty';


     if (req.body.message !== undefined && req.body.message.text !== undefined) {
          sentMessage = req.body.message.text;
          user = req.body.message.from.username || req.body.message.from.first_name;
          userId = req.body.message.from.id;
          fullName = `${req.body.message.from.first_name} ${req.body.message.from.last_name}`;
     }

     console.log("text to process: ", sentMessage);


     if (sentMessage.match(/cancel/igm) && storyteller.checkIfUserIsStoryteller(userId)) {
          console.log(`cancelled tell`);
          storyteller.cleanupStoryteller(userId)
          const textToSend = `Aktion abgebrochen, ${user} ❌`;
          this.sentMessages(req, res, textToSend);

     } else if (sentMessage.match(/greetings/igm)) {
          const textToSend = `Hi ${user}, ich bin Hermes der Zitat-Bot 👋`;
          this.sentMessages(req, res, textToSend);

     } else if (sentMessage.match(/tell/igm)) {
          if (storyteller.checkIfStorytellerIsEmpty()) {
               console.log(`entered tell`);
               const textToSend = `Hi ${user}, schreib mir welches Zitat du hinzufügen möchtest ✏️.\nSchreibe 'cancel' um abzubrechen ❌.`;
               storyteller.addStoryteller(userId, user);
               this.sentMessages(req, res, textToSend);
          } else {
               const textToSend = `Tut mir leid ${user}, ${storyteller.getStorytellerName} schreibt gerade ein Zitat.`;
               this.sentMessages(req, res, textToSend);
          }

          // var textToSend = null;
          // const quote = await quoter.getQuoteFromMessage(sentMessage);

          // // check if a quote was sent
          // if (quote) {

          //      const quoteNumber = await quoter.addNewPendingQuote(quote, userId, fullName);

          //      // check if a quote object could be built
          //      if (quoteNumber) {
          //           textToSend = `Successfully added your quote, ${user} ❤️ \n  
          //                Pending quote ${quoteNumber} : ${quote}`;
          //      } else { 
          //           textToSend = `Not able to add your quote, ${user} ☹`;
          //      }

          // } else {
          //      textToSend = `Write /tell with your quote!, ${user} 🏹`;
          // }

          //sentMessages(req, res, textToSend);

     } else if (storyteller.checkIfUserIsStoryteller(userId)) {
          tellRouter.saveAQuote(req, res, sentMessage, userId, user);

     } else if (sentMessage.match(/remove/igm)) {
          console.log(`entered remove`);
          console.log("Send response: 200");
          res.status(200).send({});

          // check if number exists
          // do actions
          // var quoteNumber = quoter.removeQuoteFromFile();
          // var quote = quoter.getQuote(quoteNumber);

          // const textToSend = `Successfully removed your quote, ${user} \n 
          //      Quote ${quoteNumber} : ${quote}`;
          // sentMessages(req, res, requestMessageType, textToSend); 

     } else if (sentMessage.match(/list/igm)) {
          const textToSend = await quoter.getDisplayableQuoteList(sentMessage);
          this.sentMessages(req, res, textToSend, userId);

     } else if (sentMessage.match(/quote/igm)) {
          const textToSend = await quoter.askForQuote(sentMessage);
          this.sentMessages(req, res, textToSend);

     } else if (sentMessage.match(/wegl/igm)) {
          const textToSend = '༼ つ ◕_◕ ༽つ';
          this.sentMessages(req, res, textToSend);

     } else {
          console.log("Send response: 200");
          res.status(200).send({});
     }
});

app.listen(PORT, () => {
     console.log(`listening on port ${PORT}`);
});

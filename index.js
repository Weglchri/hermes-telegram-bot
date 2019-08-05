'use strict';
var express = require('express');
var app = express();

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

// Lock variables
var lockTriggerTell = true;
var lockedByClient = null;

function resetLock() {
     triggerLock = true;
     lockedByClient = null;
}

// Telegram message functions 
function sentMessages(req, res, textToSend) {
    axios.post(`${APP_URL}${APITOKEN}/sendMessage`,
    {
         chat_id: req.body.message.chat.id,
         text: textToSend
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
   
     //res.status(200).send({});
     //console.log(req.body.message.from.id);
 
     console.log("Request Body: ", req.body);
     const sentMessage = req.body.message.text;
     const user = req.body.message.from.username;
     const userid = req.body.message.from.id;

     // Hermes States
     if(req.body.message.chat.id != '-145522894' && req.body.message.from.id != '211385785') {
          process.exit();
     }

     if(!sentMessage.match(/exit/igm) && triggerLock === false && lockedByClient === userid) {
          quoter.addQuoteToFile(sentMessage);
          const textToSend = `Added your quote ${user}`;
          sentMessages(req, res, textToSend);
          resetLock();
     }
  
     // Hermes Router
     if (sentMessage.match(/greetings/igm)) {
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, textToSend);
     
     } else if (sentMessage.match(/quote/igm)) {
          const textToSend = quoter.askForQuote(sentMessage);
          sentMessages(req, res, textToSend); 
       
     } else if (sentMessage.match(/tell/igm) && lockTriggerTell) {
          triggerLock = false;
          lockedByClient = userid;
          const textToSend = `Send me a quote i should know ${user}`;
          sentMessages(req, res, textToSend); 
     
     } else if (sentMessage.match(/exit/igm) && lockedByClient === userid) {
          const textToSend = `Aborted, no quote for me 🙁`;
          sentMessages(req, res, textToSend); 
          resetLock();          
          
     } else {
        res.status(200).send({});
   }
});

// Listening
app.listen(PORT, () => {
     console.log(`Listening on port ${PORT}`);
});

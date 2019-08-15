'use strict';
var express = require('express');
var app = express();
var axios = require('axios');
var bodyParser = require('body-parser');

// model
var quoter = require("./models/quoter.js");

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

// commandlist 
/*

quote - get the finest quotes of all time ⚜️
list - get all quotes available
tell - send me a quote 

*/

// telegram message functions 
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

// router actions
app.use(bodyParser.json());

app.post('/', async (req, res) => {

     console.log("Request Body: ", req.body);
     console.log(quoter.getQuotesObject()["1"].metadata.date);
     console.log(quoter.getQuotesObject()["1"].metadata.date.getTimezoneOffset());

     var sentMessage = 'empty';
     var user = 'empty';
     var userId = 'empty';
     var fullName = 'empty';

     if(req.body.message !== undefined && req.body.message.text !== undefined) {
          sentMessage = req.body.message.text;
          user = req.body.message.from.username || req.body.message.from.first_name;
          userId = req.body.message.from.id;
          fullName = `${req.body.message.from.first_name} ${req.body.message.from.last_name}`;
     }
     
     console.log("text to process: ", sentMessage);

     if (sentMessage.match(/greetings/igm)) {
          console.log(`${user} entered greetings`);
          const textToSend = `I'm Hermes the quote bot, hello ${user} 👋`;
          sentMessages(req, res, textToSend);
         
     } else if (sentMessage.match(/tell/igm)) {
          console.log(`${user} entered tell`);
          var textToSend = null;
          const quote = quoter.getQuoteFromMessage(sentMessage);
          
          if(quote) {
               const quoteNumber = await quoter.addQuoteObjectToFile(quote, userId, fullName);
               // const quoteNumber = await quoter.addQuoteToFile(quote);

               textToSend = `Successfully added your quote, ${user} ❤️ \n  
                    Quote ${quoteNumber} : ${quote}`;
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
          console.log(`${user} entered list`);
          const textToSend = await quoter.getDisplayQuoteList();
          sentMessages(req, res, textToSend, userId); 

     } else if (sentMessage.match(/quote/igm)) {
          console.log(`${user} entered quote`);
          const textToSend = await quoter.askForQuote(sentMessage);
          sentMessages(req, res, textToSend); 

     } else if (sentMessage.match(/wegl/igm)) {
          console.log(`${user} entered quote`);
          const textToSend = '༼ つ ◕_◕ ༽つ';
          sentMessages(req, res, textToSend); 

     } else {
          console.log("Send response: 200");
          res.status(200).send({});
     }
});

app.listen(PORT, () => {
     console.log(`listening on port ${PORT}`);
});

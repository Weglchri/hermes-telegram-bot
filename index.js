'use strict';
var express = require('express');
var app = express();

const bodyParser = require('body-parser');
const axios = require('axios');

var utils = require("./lib/utils.js");
var quoter = require("./lib/quoter.js");
var archiver = require("./lib/archiver.js");

const authFileData = utils.readFile('./data/authfile.json');

const url = authFileData["URL"];
const apiToken = authFileData["TOKEN"];
const port = authFileData["PORT"];

// Commandlist 
/*

greetings - athena greets you 💋
segdeg - get the finest quotes of all time
archive - manually transfer data to the nexus

*/

// Telegram Message sender 
function sentMessages(req, res, textToSend) {
    
    axios.post(`${url}${apiToken}/sendMessage`,
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
   
     res.status(200).send({});
     
     console.log("Request Body: ", req.body);
     const sentMessage = req.body.message.text;

     if (sentMessage.match(/greetings/igm)) {
          const user = req.body.message.from.username;
          const textToSend = `I'm Athena the archiver bot, hello ${user} 👋`;
          sentMessages(req, res, textToSend);
     
     } else if (sentMessage.match(/segdeg/igm)) {
          const textToSend = quoter.askForQuote(sentMessage);
          sentMessages(req, res, textToSend); 
          
     } else if (sentMessage.match(/archive/igm)) {

          const srcDir = '/Users/Wegls/Library/Group Containers/6N38VWS5BX.ru.keepcoder.Telegram/account-1665989533078466624/postbox/media';
          const descDir = '/Users/Wegls/Desktop/testfolder/test';
          
          // archiver.getAllFilesFromSource(srcDir)
          // .then((files) => archiver.copyTelegramFiles(srcDir,descDir,files))
          // .then(function() {
          //      console.log("Finished successfully")
          //      sentMessages(req, res, 'Successfully send all data to the nexus');
          // })
          // .catch(function(error) {
          //      console.log(error);
          //      sentMessages(req, res, 'Something went wrong 🙁');
          // });

     } else {
        res.status(200).send({});
   }
});

// Listening
app.listen(port, () => {
     console.log(`Listening on port ${port}`);
});

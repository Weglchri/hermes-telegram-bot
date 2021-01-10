'use strict';

var storyteller = require("../models/storyteller.js");
var bot = require("../router/bot.js");

module.exports = {

     saveAQuote: function (req, res, sentMessage, userId, user) {

          if (!storyteller.checkDictForKey(storyteller.getQuoteDict(), userId)) {
               console.log(`${user} entered quote dict`);

               storyteller.addToQuoteDict(userId, sentMessage);
               console.log(storyteller.getQuoteDict());
               const textToSend = `Gut, von wem war das Zitat?`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getCreatorDict(), userId)) {
               console.log(`${user} entered creator dict`);

               storyteller.addToCreatorDict(userId, sentMessage);
               console.log(storyteller.getCreatorDict());
               const textToSend = `Perfekt, aus welchem Jahr ist das Zitat?`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getYearDict(), userId)) {
               console.log(`${user} entered year dict`);

               storyteller.addToYearDict(userId, sentMessage);
               console.log(storyteller.getYearDict());
               const textToSend = `Exzellent, bitte eine kurze Beschreibung zu dem Zitat.`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getDescriptionDict(), userId)) {
               console.log(`${user} entered description dict`);

               storyteller.addToDescriptionDict(userId, sentMessage);
               console.log(storyteller.getDescriptionDict());
               const textToSend = `Die Daten werden jetzt bearbeitet.`;
               bot.sentMessages(req, res, textToSend);
               storyteller.cleanupStoryteller(userId);
          
          } else {
               console.log(`${user} entered else option`);
               const textToSend = `Das sollte nicht passieren, du hast einen Bug gefunden, Gratulation!`;
               storyteller.cleanupStoryteller(userId);
               bot.sentMessages(req, res, textToSend);
          }
     }

}


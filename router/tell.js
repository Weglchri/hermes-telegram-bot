'use strict';

var storyteller = require("../models/storyteller.js");
var bot = require("../router/bot.js");

module.exports = {

     saveAQuote: function (req, res, sentMessage, userId, user) {

          if (!storyteller.checkDictForKey(storyteller.getQuoteDict(), userId)) {
               console.log(`${user} entered quote dict`);

               storyteller.addToQuoteDict(userId, sentMessage);
               console.log(storyteller.getQuoteDict());
               const textToSend = `Perfect, now tell me the originator of this quote.`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getCreatorDict(), userId)) {
               console.log(`${user} entered creator dict`);

               storyteller.addToCreatorDict(userId, sentMessage);
               console.log(storyteller.getCreatorDict());
               const textToSend = `Great, in which year did this quote appear first?`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getYearDict(), userId)) {
               console.log(`${user} entered year dict`);

               storyteller.addToYearDict(userId, sentMessage);
               console.log(storyteller.getYearDict());
               const textToSend = `Excellent, now some context to this quote, why did it happen?`;
               bot.sentMessages(req, res, textToSend);

          } else if (!storyteller.checkDictForKey(storyteller.getDescriptionDict(), userId)) {
               console.log(`${user} entered description dict`);

               storyteller.addToDescriptionDict(userId, sentMessage);
               console.log(storyteller.getDescriptionDict());
               const textToSend = `Will quickly process your data now.`;
               bot.sentMessages(req, res, textToSend);
               storyteller.cleanupStoryteller(userId);
          
          } else {
               console.log(`${user} entered else option`);
               const textToSend = `This should not happen, gratulations you found a bug.`;
               teller.cleanupStoryteller(userId);
               bot.sentMessages(req, res, textToSend);
          }
     }

}


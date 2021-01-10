'use strict';

var teller = require("../models/teller.js");
var bot = require("../router/bot.js");

module.exports = {
    
    tellAQuoteToBot: function (req, res, sentMessage, userId, user, fullName) {
        
        if (sentMessage.match(/cancel/igm)) {
            console.log(`Cancelled tell ${user}`);
            teller.cleanupTeller(userId)
            const textToSend = `Action cancelled, ${user} ❌`;
            bot.sentMessages(req, res, textToSend);

       } else if (!teller.checkDictForKey(teller.getQuoteDict(), userId)) {
            console.log(`${user} entered quote dict`);
            
            teller.addToQuoteDict(userId, sentMessage);
            console.log(teller.getQuoteDict());
            const textToSend = `Perfect, now tell me the originator of this quote.`;
            bot.sentMessages(req, res, textToSend);

       } else if (!teller.checkDictForKey(teller.getCreatorDict(), userId)) {
            console.log(`${user} entered creator dict`);
            
            teller.addToCreatorDict(userId, sentMessage);
            console.log(teller.getCreatorDict());
            const textToSend = `Great, in which year did this quote appear first?`;
            bot.sentMessages(req, res, textToSend);

       } else if (!teller.checkDictForKey(teller.getYearDict(), userId)) {
            console.log(`${user} entered year dict`);
            
            teller.addToYearDict(userId, sentMessage);
            console.log(teller.getYearDict());
            const textToSend = `Excellent, now some context to this quote, why did it happen?`;
            bot.sentMessages(req, res, textToSend);

       } else if (!teller.checkDictForKey(teller.getDescriptionDict(), userId)) {
            console.log(`${user} entered description dict`);
            
            teller.addToDescriptionDict(userId, sentMessage);
            console.log(teller.getDescriptionDict());
            const textToSend = `Will quickly process your data now.`;
            bot.sentMessages(req, res, textToSend);

       }
    }

}


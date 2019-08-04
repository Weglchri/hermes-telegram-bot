'use strict';
var utils = require("./utils.js");

// prevent athena sending same quote twice 
const QUOTE_ARRAY = 10;
var quotesList = [];

module.exports = {

    updateQuoteList : function(quote) {
        if(Object.keys(quotesList).length >= QUOTE_ARRAY) {
            quotesList.shift();
        }
        quotesList.push(quote);
    },

    getValidRandomNumber : function(jsonDataLength) {
        let random = utils.getRandomInt(jsonDataLength) + 1;
        while (quotesList.includes(random)) {
            random = utils.getRandomInt(jsonDataLength) + 1;
        }
        return random;
    },
       
    getQuote : function(number) {
        let quoteData = this.readQuotesFile();
        this.updateQuoteList(number);
        let quote = quoteData[number];
        return quote;
    },

    getRandomQuote : function() {
        let quoteData = this.readQuotesFile();
        let jsonDataLength = Object.keys(quoteData).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let quote = quoteData[number];
        return quote;
    },

    readQuotesFile : function() {
        const quotes = utils.readFile('./data/segdeg.json');
        return quotes;
    },

    askForQuote : function(message) {
        const quoteNumber = message.split("/")[2];
        if(quoteNumber === undefined) {
            return this.getRandomQuote();
        }
        return this.getQuote(quoteNumber);     
    }
}
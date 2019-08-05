'use strict';
var utils = require("../lib/utils.js");

// prevent hermes sending same quote twice 
const QUOTE_FILE = './data/segdeg.json';
const QUOTE_ARRAY = 10;
var quotesList = [];

module.exports = {

    getQuotesList : function() {
        return quotesList;
    },

    emptyQuotesList : function() {
        quotesList = [];
    },

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
        let quoteDataObject = this.readQuotesFile();
        this.updateQuoteList(number);
        let quote = quoteDataObject[number];
        return quote;
    },

    getRandomQuote : function() {
        let quoteDataObject = this.readQuotesFile();
        let jsonDataLength = Object.keys(quoteDataObject).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let quote = quoteDataObject[number];
        return quote;
    },

    readQuotesFile : function() {
        const quotes = utils.readFile(QUOTE_FILE);
        return quotes;
    },

    askForQuote : function(message) {
        const quoteNumber = message.split("/")[2];
        if(quoteNumber === undefined) {
            return this.getRandomQuote();
        }
        return this.getQuote(quoteNumber);     
    },

    addQuoteToFile : function(quote) {
        const quoteDataObject = this.readQuotesFile();
        const jsonDataLength = Object.keys(quoteDataObject).length;
        quoteDataObject[jsonDataLength + 1] = this.checkForValidQuote(qoute);
    },

    checkForValidQuote : function(quote) {
        //todo: implement validation functionality
        return quote;
    }


}
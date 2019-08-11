'use strict';

const utils = require("../lib/utils.js");
const s3Dao = require("../daos/s3QuoterDao.js");
const validator = require("../validators/quoteValidator.js");

var QUOTE_ARRAY = process.env.QUOTESARRAY;
var QUOTES_OBJECT = null;
var quotesList = [];

module.exports = {

    executeQuoteFileUpdate: async function (file) {
        let quotesFile = await s3Dao.getQuotesFileFromS3(file);
        QUOTES_OBJECT = JSON.parse(quotesFile);
    },

    addQuoteToFile: async function (file, quote) {
        let quoteDataObject = this.getQuotesObject();
        let lastObjectKey = utils.getLastObjectElement(quoteDataObject);
        
        console.log(lastObjectKey);
        quoteDataObject[lastJsonObjectKey + 1] = quote;
        
        console.log(quoteDataObject);
        await s3Dao.sendQuotesFileToS3(file, quoteDataObject);
        QUOTES_OBJECT = quoteDataObject;
        return jsonDataLength + 1;
    },

    getQuotesObject: function () {
        return QUOTES_OBJECT;
    },

    removeQuoteFromFile: async function (file, quoteNumber) {
        // check if it's a valid number to remove 
        if (quoteNumber === false) { 
            return false; 
        } else {
            console.log("valid quote number");
        }

        // check how many quotes and valid range
        let quoteDataObject = this.getQuotesObject();
        let lastObjectKey = utils.getObjectLength(quoteDataObject);

        if (quoteNumber > lastObjectKey || quoteNumber <= 0) {
            return false;
        } else {
            console.log("valid quote range");
        }

        let quote = this.getQuote(quoteNumber);
        // delete quote from list and send list to S3
        delete quoteDataObject[quoteNumber];
        await s3Dao.sendQuotesFileToS3(file, quoteDataObject);
        QUOTES_OBJECT = quoteDataObject;
        return quote;
    },

    getQuotesList: function () {
        return quotesList;
    },

    emptyQuotesList: function () {
        quotesList = [];
    },

    updateQuoteList: function (quoteNumber) {
        if (Object.keys(quotesList).length >= QUOTE_ARRAY) {
            quotesList.shift();
        }
        quotesList.push(quoteNumber);
    },

    getQuote: async function (quoteNumber) {
        let quoteDataObject = this.getQuotesObject();
        this.updateQuoteList(quoteNumber);
        let quote = quoteDataObject[quoteNumber] || 'No quote found';
        return quote;
    },

    getRandomQuote: async function () {
        let quoteDataObject = this.getQuotesObject();
        let lastObjectKey = utils.getLastObjectElement(quoteDataObject);
        let number = this.getValidRandomNumber(lastObjectKey);
        this.updateQuoteList(number);
        let quote = quoteDataObject[number];
        return quote;
    },

    askForQuote: async function (message) {
        let quoteNumber = this.getQuoteFromMessage(message);
        if (quoteNumber === false) {
            return await this.getRandomQuote();
        }
        return await this.getQuote(quoteNumber);
    },

    getQuoteFromMessage: function (message) {
        let pattern = /\s(.*)/igm;
        let quote = pattern.exec(message);
        if (quote !== null && quote.length == 2 && quote[1] != '')
            return quote[1]
        else
            return false;
    },

    getDisplayQuoteList: async function () {
        let quoteObject = await this.getQuotesObject();
        let stringList = '';
        Object.entries(quoteObject).forEach (
            ([key, value]) => stringList = stringList.concat(`${key}: ${value} \n`)
        );
        return stringList;
    },

    getValidRandomNumber: function (lastObjectKey) {
        let random = utils.getRandomInt(lastObjectKey) + 1;
        while (quotesList.includes(random)) {
            random = utils.getRandomInt(lastObjectKey) + 1;
            console.log(random);
        }
        return random;
    }

}
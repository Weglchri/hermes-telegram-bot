'use strict';
var utils = require("../lib/utils.js");
var s3Dao = require("../daos/s3QuoterDao.js");

// prevent hermes sending same quote twice 
const S3_QUOTE_FILE_PATH = process.env.S3FILE || 'testfolder/segdeg.json';
const QUOTE_ARRAY = 10;
var quotesList = [];
var QUOTE_FILE = null;

module.exports = {
    
    addQuoteToFile: async function (quote) {
        var quoteDataObject = await this.readQuotesFile();
        var jsonDataLength = Object.keys(quoteDataObject).length;
        quoteDataObject[jsonDataLength + 1] = quote;
        //utils.writeFile(QUOTE_FILE, JSON.stringify(quoteDataObject));
        await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
        return jsonDataLength + 1;
    },

    readQuotesFile: async function () {
        //const quotes = utils.readFileAsJSONObject(QUOTE_FILE);
        QUOTE_FILE = QUOTE_FILE || await s3Dao.getQuotesFileFromS3(S3_QUOTE_FILE_PATH);
        var parsedQuotes = JSON.parse(QUOTE_FILE);
        return parsedQuotes;
    },

    removeQuoteFromFile: async function(quoteNumber) {
        var quoteDataObject = await this.readQuotesFile();
        delete quoteDataObject[quoteNumber];
        await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
        //utils.writeFile(QUOTE_FILE, JSON.stringify(quoteDataObject)); 
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

    getValidRandomNumber: function (jsonDataLength) {
        let random = utils.getRandomInt(jsonDataLength) + 1;
        while (quotesList.includes(random)) {
            random = utils.getRandomInt(jsonDataLength) + 1;
        }
        return random;
    },

    getQuote: async function (quoteNumber) {
        let quoteDataObject = await this.readQuotesFile();
        this.updateQuoteList(quoteNumber);
        let quote = quoteDataObject[quoteNumber] || 'No quote found';
        return quote;
    },

    getRandomQuote: async function () {
        let quoteDataObject = await this.readQuotesFile();
        let jsonDataLength = Object.keys(quoteDataObject).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let quote = quoteDataObject[number];
        return quote;
    },

    askForQuote: async function (message) {
        const quoteNumber = message.split("/")[2];
        if (quoteNumber === undefined) {
            return await this.getRandomQuote();
        }
        return await this.getQuote(quoteNumber);
    },

    // checkForValidQuote: async function (quoteNumber) {
    //     var quoteDataObject = await this.readQuotesFile();
    //     let quote = quoteDataObject[quoteNumber];
    //     return quote === undefined ? false : true;
    // },

    getQuoteFromMessage: function (message) {
        var pattern = /\s(.*)/igm;
        var newQuote = pattern.exec(message)[1];
        return newQuote;
    },
           
}
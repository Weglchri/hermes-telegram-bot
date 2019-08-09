'use strict';

var utils = require("../lib/utils.js");
var s3Dao = require("../daos/s3QuoterDao.js");

// prevent hermes sending same quote twice 
const S3_QUOTE_FILE_PATH = process.env.S3FILE;

const QUOTE_ARRAY = 10;
var QUOTES_OBJECT = null;
var quotesList = [];

module.exports = {

    executeQuoteFileUpdate : async function() {
        var QUOTES_FILE = await s3Dao.getQuotesFileFromS3(S3_QUOTE_FILE_PATH);
        QUOTES_OBJECT = JSON.parse(QUOTES_FILE);
    },

    addQuoteToFile: async function (quote) {
        var quoteDataObject = this.getQuotesObject();
        var jsonDataLength = Object.keys(quoteDataObject).length;
        quoteDataObject[jsonDataLength + 1] = quote;
        await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
        await this.executeQuoteFileUpdate();
        return jsonDataLength + 1;
    },

    getQuotesObject : function() {
        return QUOTES_OBJECT;
    },

    removeQuoteFromFile: async function(quoteNumber) {
        var quoteDataObject = this.getQuotesObject();
        delete quoteDataObject[quoteNumber];
        await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
        this.executeQuoteFileUpdate();
    },

    getQuotesList: function () {
        return quotesList;
    },

    emptyQuotesList: function () {
        quotesList = [];
    },

    updateQuoteList: function (quoteNumber) {
        console.log(quoteNumber);
        if (Object.keys(quotesList).length >= QUOTE_ARRAY) {
            quotesList.shift();
        }
        quotesList.push(quoteNumber);
    },

    getValidRandomNumber: function (jsonDataLength) {
        let random = utils.getRandomInt(jsonDataLength) + 1;
        while (quotesList.includes(random)) {
            random = utils.getRandomInt(jsonDataLength) + 1;
            console.log(random);
        }
        return random;
    },

    getQuote: async function (quoteNumber) {
        let quoteDataObject = this.getQuotesObject();
        this.updateQuoteList(quoteNumber);
        let quote = quoteDataObject[quoteNumber] || 'No quote found';
        return quote;
    },

    getRandomQuote: async function () {
       console.log("new call");
        let quoteDataObject = this.getQuotesObject();
        let jsonDataLength = Object.keys(quoteDataObject).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let quote = quoteDataObject[number];
        return quote;
    },

    askForQuote: async function (message) {
        const quoteNumber = message.split("/")[2];
        if (quoteNumber === undefined) {
            console.log(message);
            return await this.getRandomQuote();
        }
        return await this.getQuote(quoteNumber);
    },

    getQuoteFromMessage: function (message) {
        var pattern = /\s(.*)/igm;
        var newQuote = pattern.exec(message)[1];
        return newQuote;
    },
           
}
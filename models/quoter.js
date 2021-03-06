'use strict';

var utils = require("../lib/utils.js");
var s3Dao = require("../daos/s3QuoterDao.js");
var JsonBuilder = require("./jsonBuilder.js");

// prevent hermes sending same quote twice 
const S3_QUOTE_FILE_PATH = process.env.S3FILE;

const QUOTE_ARRAY = 10;
var QUOTES_OBJECT = null;
var quotesList = [];

module.exports = {

    getQuotesObject: function () {
        return QUOTES_OBJECT;
    },

    executeQuoteFileUpdate: async function () {
        var QUOTES_FILE = await s3Dao.getQuotesFileFromS3(S3_QUOTE_FILE_PATH);
        QUOTES_OBJECT = JSON.parse(QUOTES_FILE);
    },

    addQuoteObjectToFile : async function(quote, userId, fullName) {
        var quoteDataObject = this.getQuotesObject();
        var jsonDataLength = Object.keys(quoteDataObject).length;

        var jb = new JsonBuilder();
        jb.addQuote(quote);
        jb.addUserId(userId);
        jb.addFullName(fullName);
        jb.addDate();
        jb.addMetadata();
        var jsonObject = jb.buildJSONObject();

        quoteDataObject[jsonDataLength + 1] = jsonObject;
        QUOTES_OBJECT = quoteDataObject;
        await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
        return jsonDataLength + 1;
    },

    removeQuoteFromFile: async function (quoteNumber) {
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
        let jsonObject = quoteDataObject[quoteNumber] || 'No quote found';
        return jsonObject.quote;
    },

    getRandomQuote: async function () {
        console.log("new call");
        let quoteDataObject = this.getQuotesObject();
        let jsonDataLength = Object.keys(quoteDataObject).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let jsonObject = quoteDataObject[number];
        return jsonObject.quote;
    },

    askForQuote: async function (message) {
        const quoteNumber = this.getQuoteFromMessage(message);
        if (quoteNumber === false) {
            console.log(message);
            return await this.getRandomQuote();
        }
        return await this.getQuote(quoteNumber);
    },

    getQuoteFromMessage: function (message) {
        var pattern = /\s(.*)/igm;
        var quote = pattern.exec(message);
        if (quote !== null && quote.length == 2 && quote[1] != '')
            return quote[1]
        else
            return false;
    },

    getDisplayQuoteList: async function () {
        var quoteObject = await this.getQuotesObject();
        var stringList = '';
        Object.entries(quoteObject).forEach(
            ([key, value]) => stringList = stringList.concat(`${key}: \t ${value.quote} \n`)
        );
        return stringList;
    }

}
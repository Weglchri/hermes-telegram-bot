'use strict';

var utils = require("../lib/utils.js");
var s3Dao = require("../daos/s3QuoterDao.js");
var JsonBuilder = require("./jsonBuilder.js").JsonBuilder;
var STATUS = require("./jsonBuilder.js").STATUS;

const APPROVED_S3_QUOTE_FILE_PATH = process.env.QUOTES_APPROVED_S3FILE;
const PENDING_S3_QUOTE_FILE_PATH = process.env.QUOTES_PENDING_S3FILE;

// cache objects
var APPROVED_QUOTES_OBJECT = null;
var PENDING_QUOTES_OBJECT = null;

// prevent hermes sending same quote twice 
const QUOTE_ARRAY = 10;
var quotesList = [];

module.exports = {

    getApprovedQuotesObject: function () {
        return APPROVED_QUOTES_OBJECT;
    },

    getPendingQuotesObject: function () {
        return PENDING_QUOTES_OBJECT;
    },

    executeApprovedQuoteFileUpdate: async function () {
        var APPROVED_QUOTES_FILE = await s3Dao.getQuotesFileFromS3(APPROVED_S3_QUOTE_FILE_PATH);
        APPROVED_QUOTES_OBJECT = JSON.parse(APPROVED_QUOTES_FILE);
    },

    executePendingQuoteFileUpdate: async function () {
        var PENDING_QUOTES_FILE = await s3Dao.getQuotesFileFromS3(PENDING_S3_QUOTE_FILE_PATH);
        PENDING_QUOTES_OBJECT = JSON.parse(PENDING_QUOTES_FILE);
    },

    addNewPendingQuote : async function(quote, userId, fullName) {
        var quoteDataObject = this.getPendingQuotesObject();
        var jsonDataLength = Object.keys(quoteDataObject).length;

        // build pending json object 
        var jb = new JsonBuilder();
        jb.addQuote(quote);
        jb.addUserId(userId);
        jb.addFullName(fullName);
        jb.addDate();
        jb.addApprovals();
        jb.addStatus(STATUS.PENING);
        jb.addMetadata();
        var jsonObject = jb.buildJSONObject();

        // add pending quote to pending object
        quoteDataObject[jsonDataLength + 1] = jsonObject;
        PENDING_QUOTES_OBJECT = quoteDataObject;

        // write pending file to aws
        await s3Dao.sendQuotesFileToS3(PENDING_S3_QUOTE_FILE_PATH, quoteDataObject);
        
        // return object length to caller 
        return jsonDataLength + 1;
    },

    // addQuoteObjectToFile : async function(quote, userId, fullName) {
    //     var quoteDataObject = this.getQuotesObject();
    //     var jsonDataLength = Object.keys(quoteDataObject).length;

    //     var jb = new JsonBuilder();
    //     jb.addQuote(quote);
    //     jb.addUserId(userId);
    //     jb.addFullName(fullName);
    //     jb.addDate();
    //     jb.addMetadata();
    //     var jsonObject = jb.buildJSONObject();

    //     quoteDataObject[jsonDataLength + 1] = jsonObject;
    //     QUOTES_OBJECT = quoteDataObject;
    //     await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
    //     return jsonDataLength + 1;
    // },

    // removeQuoteFromFile: async function (quoteNumber) {
    //     var quoteDataObject = this.getQuotesObject();
    //     delete quoteDataObject[quoteNumber];
    //     await s3Dao.sendQuotesFileToS3(S3_QUOTE_FILE_PATH, quoteDataObject);
    //     this.executeQuoteFileUpdate();
    // },

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
        let quoteDataObject = this.getApprovedQuotesObject();
        this.updateQuoteList(quoteNumber);
        let jsonObject = quoteDataObject[quoteNumber] || 'No quote found';
        return jsonObject.quote;
    },

    getRandomQuote: async function () {
        console.log("new call");
        let quoteDataObject = this.getApprovedQuotesObject();
        let jsonDataLength = Object.keys(quoteDataObject).length;
        let number = this.getValidRandomNumber(jsonDataLength);
        this.updateQuoteList(number);
        let jsonObject = quoteDataObject[number];
        return jsonObject.quote;
    },

    askForQuote: async function (message) {
        const quoteNumber = await utils.extractElementFromMessage(message);
        if (quoteNumber) {
            return await this.getQuote(quoteNumber);
        } else {
            return await this.getRandomQuote();
        }
    },

    getQuoteFromMessage: async function(message) {
        const quote = await utils.extractElementFromMessage(message);
        return quote;
    },

    getDisplayableQuoteList: async function (message) {

        var element = await utils.extractElementFromMessage(message);
        console.log(element);
        if(element.toString().toLowerCase() === 'pending') {
            console.log("entered pending list");
            var quoteObject = await this.getPendingQuotesObject();
        } else {
            console.log("entered approval list");
            var quoteObject = await this.getApprovedQuotesObject();
        }

        // logic for displaying approval and update for specific user

        var stringList = '';
        Object.entries(quoteObject).forEach (
            ([key, value]) => stringList = stringList.concat(`${key}: \t ${value.quote} \n`)
        );
        return stringList;
    }

}
'use strict';

var utils = require("../lib/utils.js");

var storytellers = [];
var quoteDict = {};
var creatorDict = {};
var yearDict = {};
var descriptionDict = {};

module.exports = {

    checkIfUserIsStoryteller: function(userId) {
        return this.getStorytellers().includes(userId);
    },

    getStorytellers: function () {
        return storytellers;
    },
    
    addStoryteller: function(userId) {
        storytellers.push(userId);
    },

    deleteStoryteller: function(userId) {
        storytellers = utils.removeElementFromArray(storytellers, userId);
    },

    // quotes dictionary operations
    
    getQuoteDict: function() {
        return quoteDict;
    },

    addToQuoteDict: function(key, value) {
        quoteDict[key] = value;
    },

    deleteFromQuoteDict: function(key) {
        delete quoteDict[key];
    },

     // creator dictionary operations

    getCreatorDict: function() {
        return creatorDict;
    },

    addToCreatorDict: function(key, value) {
        creatorDict[key] = value;
    },

    deleteFromCreatorDict: function(key) {
        delete creatorDict[key];
    },

    // years dictionary operations
    
    getYearDict: function() {
        return yearDict;
    },

    addToYearDict: function(key, value) {
        yearDict[key] = value;
    },

    deleteFromYearDict: function(key) {
        delete yearDict[key];
    },

    // years dictionary operations
    
    getDescriptionDict: function() {
        return descriptionDict;
    },

    addToDescriptionDict: function(key, value) {
        descriptionDict[key] = value;
    },

    deleteFromDescriptionDict: function(key) {
        delete descriptionDict[key];
    },

    getValueFromDict: function(dict, key) {
        return dict[key];
    },

    checkDictForKey: function(dict, key) {
        return (dict[key] ? true : false);
    },

    cleanupStoryteller: function(key) {
        this.deleteStoryteller(key);
        this.deleteFromQuoteDict(key);
        this.deleteFromCreatorDict(key);
        this.deleteFromYearDict(key);
        this.deleteFromDescriptionDict(key);
    }
}
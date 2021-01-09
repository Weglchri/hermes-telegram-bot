'use strict';

var assert = require('assert');
var teller = require("../models/teller.js");

describe('Teller feature test', function () {

    describe('Check story teller functions', function () {

        it('Add user as story teller', function () {
            teller.addStoryTeller(123456789);
            var user = teller.getStoryTellers()[0];
            assert.equal(user, 123456789);
        });

        it('Add quote from story teller', function () {
            teller.addToQuoteDict(123456789, "This is a new quote");
            var quoteDict = teller.getQuoteDict();
            assert.equal(teller.checkDictForKey(quoteDict, 123456789), true);
            assert.equal(teller.getValueFromDict(quoteDict, 123456789), "This is a new quote");
        });

        it('Add creator as story teller', function () {
            teller.addToCreatorDict(123456789, "Herbertus Testerus");
            var creatorDict = teller.getCreatorDict();
            assert.equal(teller.checkDictForKey(creatorDict, 123456789), true);
            assert.equal(teller.getValueFromDict(creatorDict, 123456789), "Herbertus Testerus");
        });

        it('Add year as story teller', function () {
            teller.addToYearDict(123456789, 2019);
            var yearDict = teller.getYearDict();
            assert.equal(teller.checkDictForKey(yearDict, 123456789), true);
            assert.equal(teller.getValueFromDict(yearDict, 123456789), 2019);
        });

        it('Add description as story teller', function () {
            teller.addToDescriptionDict(123456789, "so this happened after the....");
            var descriptionDict = teller.getDescriptionDict();
            assert.equal(teller.checkDictForKey(descriptionDict, 123456789), true);
            assert.equal(teller.getValueFromDict(descriptionDict, 123456789), "so this happened after the....");
        });

    });

});
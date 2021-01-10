'use strict';

var assert = require('assert');
var storyteller = require("../models/storyteller.js");

describe('Teller feature test', function () {

    describe('Check story teller functions', function () {

        it('Add user as story teller', function () {
            storyteller.addStoryteller(123456789);
            var user = storyteller.getStorytellers()[0];
            assert.equal(user, 123456789);
        });

        it('Add quote from story teller', function () {
            storyteller.addToQuoteDict(123456789, "This is a new quote");
            var quoteDict = storyteller.getQuoteDict();
            assert.equal(storyteller.checkDictForKey(quoteDict, 123456789), true);
            assert.equal(storyteller.getValueFromDict(quoteDict, 123456789), "This is a new quote");
        });

        it('Add creator as story teller', function () {
            storyteller.addToCreatorDict(123456789, "Herbertus Testerus");
            var creatorDict = storyteller.getCreatorDict();
            assert.equal(storyteller.checkDictForKey(creatorDict, 123456789), true);
            assert.equal(storyteller.getValueFromDict(creatorDict, 123456789), "Herbertus Testerus");
        });

        it('Add year as story teller', function () {
            storyteller.addToYearDict(123456789, 2019);
            var yearDict = storyteller.getYearDict();
            assert.equal(storyteller.checkDictForKey(yearDict, 123456789), true);
            assert.equal(storyteller.getValueFromDict(yearDict, 123456789), 2019);
        });

        it('Add description as story teller', function () {
            storyteller.addToDescriptionDict(123456789, "so this happened after the....");
            var descriptionDict = storyteller.getDescriptionDict();
            assert.equal(storyteller.checkDictForKey(descriptionDict, 123456789), true);
            assert.equal(storyteller.getValueFromDict(descriptionDict, 123456789), "so this happened after the....");
        });

    });

});
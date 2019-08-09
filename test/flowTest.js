'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Heavy Test', function () {

    describe('get 10 quotes', function () {

        beforeEach(async function () {
            quoter.emptyQuotesList();
            await quoter.executeQuoteFileUpdate();
        });

        it('ask for three predefined quotes', async function () {
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
            console.log(await quoter.askForQuote("/quote"));
        });


    });

});
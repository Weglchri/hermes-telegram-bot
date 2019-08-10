
'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Calls function test', function () {

    describe('test crud functions', function () {

        beforeEach(async function () {
            quoter.emptyQuotesList();
            await quoter.executeQuoteFileUpdate();
        });

        it('list all elements', async function() {
            var textToSend = await quoter.getDisplayQuoteList();
            console.log(textToSend);
        });
    
    });

});
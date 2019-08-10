
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

    describe('check call json body object', function () {

        beforeEach(async function () {
            quoter.emptyQuotesList();
            await quoter.executeQuoteFileUpdate();
        });

        it('json object', async function() {
            var body = {
                "message" : {
                    "hello" : {
                        "from" : "test1"
                    }
                }
            };
            console.log(body);
            assert.equal("test1", body.message.hello.from);

            var text = body.message.hello.from || body.message.hello.undef.undeffrom || 'empty';
            assert.equals('empty', text);
        });
    
    });

});
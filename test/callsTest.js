
'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Calls function test', function () {

    // describe('test crud functions', function () {

    //     beforeEach(async function () {
    //         quoter.emptyQuotesList();
    //         await quoter.executeQuoteFileUpdate();
    //     });

    //     it('list all elements', async function() {
    //         var textToSend = await quoter.getDisplayQuoteList();
    //         console.log(textToSend);
    //     });
    
    // });

    describe('check call json body object', function () {

        it('json object', async function() {
            
            var body = {
                "message" : {
                    "hello" : {
                        "from" : "test1"
                    }
                }
            };
            
            assert.equal("test1", body.message.hello.from);
            var text = body.message.hello.from || body.message.hello.undef.undeffrom;
            assert.equal('test1', text);
        });
    
        it('json object keys test', async function() {
            
            var body = {
                "message" : {
                    "hello" : {
                        "from1" : "test1",
                        "from2" : "test2",
                        "form3" : "test3"
                    }
                }
            };
            
            let lastElement = Object.keys(body.message.hello).pop();
            assert.equal("test3", body.message.hello[lastElement]);
        });

    });

});
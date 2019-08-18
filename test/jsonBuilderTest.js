

'use strict';

var assert = require('assert');
var utils = require("../lib/utils.js");
var JsonBuilder = require("../models/jsonBuilder.js").JsonBuilder;
var STATUS = require("../models/jsonBuilder.js").STATUS;

describe('Test JSON Builder', function () {

      describe('check builder function', function () {

            it('create happy path object', function () {
                
                let testObject = {
                    quote: 'This is a new quote',
                    metadata: { 
                        userId: 123456789,
                        author: 'Herbert Yesas', 
                        date: new Date(),
                        status: "PENDING"                        
                    }
                }

                var jb = new JsonBuilder();
                jb.addQuote("This is a new quote");
                jb.addUserId(123456789);
                jb.addFullName("Herbert Yesas");
                jb.addDate();
                jb.addStatus(STATUS.PENDING);
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();
                assert.deepEqual(testObject, jsonObject)

            });

            it('create bad path object', function () {
                
                var jb = new JsonBuilder();
                jb.addFullName("Herbert Yesas");
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();
                assert.equal('invalid data', jsonObject);

            });

      });

});




'use strict';

var assert = require('assert');
var JsonBuilder = require("../models/jsonBuilder.js");

describe('Test JSON Builder', function () {

      describe('check builder function', function () {

            it('create happy path object', function () {
                
                let jsonDate = new Date(Date.now()).toISOString();
                let testObject = {
                    quote: 'This is a new quote',
                    metadata: { 
                        author: 'Herbert Yesas', 
                        date: jsonDate
                    }
                }

                var jb = new JsonBuilder();
                jb.addQuote("This is a new quote");
                jb.addFullName("Herbert Yesas");
                jb.addDate();
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();
                assert.deepEqual(testObject, jsonObject)

            });

            it('create bad path object', function () {
                
                var jb = new JsonBuilder();
                jb.addFullName("Herbert Yesas");
                jb.addDate();
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();
                assert.equal('invalid data', jsonObject);

            });

      });

});


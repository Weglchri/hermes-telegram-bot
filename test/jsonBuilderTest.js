

'use strict';

var assert = require('assert');
var JsonBuilder = require("../models/jsonBuilder.js");

describe('Test JSON Builder', function () {

      describe('check builder function', function () {

            it('create happy path object', function () {
                
                var testObject = {
                    quote: 'This is a new quote',
                    metadata: { 
                        author: 'Herbert Yesas', 
                        date: '2019-08-12' 
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


'use strict';

var assert = require('assert');
var utils = require("../lib/utils.js");
var JsonBuilder = require("../models/jsonBuilder.js").JsonBuilder;
var STATUS = require("../models/jsonBuilder.js").STATUS;

describe('Builder feature test', function () {

      describe('Check builder function', function () {

            it('Create happy path object', function () {
                
                let testObject = {
                    quote: 'This is a new quote',
                    status: "PENDING",  
                    approvals : [],         
                    metadata: { 
                        userId: 123456789,
                        author: 'Herbert Yesas', 
                        date: new Date(),          
                    }
                }

                var jb = new JsonBuilder();
                jb.addQuote("This is a new quote");
                
                jb.addApprovals();
                jb.addStatus(STATUS.PENDING);
                jb.addUserId(123456789);
                
                jb.addFullName("Herbert Yesas");
                jb.addDate();
                jb.addMetadata();

                var jsonObject = jb.buildJSONObject();
                assert.deepEqual(testObject, jsonObject)

            });

            it('Create bad path object', function () {
                
                var jb = new JsonBuilder();
                jb.addFullName("Herbert Yesas");
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();
                assert.equal(false, jsonObject);

            });

            it('Approvals array test', function () {
                
                let testObject = {
                    quote: 'This is a new quote',
                    status: "PENDING",  
                    approvals : [123456789],         
                    metadata: { 
                        userId: 123456789,
                        author: 'Herbert Yesas', 
                        date: new Date(),          
                    }
                }

                var jb = new JsonBuilder();
                jb.addQuote("This is a new quote");
            
                jb.addApprovals()
                jb.addStatus(STATUS.PENDING);

                jb.addUserId(123456789);
                jb.addFullName("Herbert Yesas");
                jb.addDate();
                jb.addMetadata();
                var jsonObject = jb.buildJSONObject();

                jsonObject.approvals.push(123456789);
                assert.deepEqual(testObject, jsonObject)

            });

      });

});


'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Quote Test', function() {
  
  describe('check quote list updates', function() {
    
    beforeEach(function() {
      quoter.emptyQuotesList();
    });

    it('ask for three predefined quotes', function() {
      quoter.askForQuote("/segdeg/1");
      quoter.askForQuote("/segdeg/2");
      quoter.askForQuote("/segdeg/3");
      assert.deepEqual(["1", "2", "3"], quoter.getQuotesList());
    });

    it('call with one predefined quote', function() {
      quoter.askForQuote("/segdeg/1")
      assert.equal(1, quoter.getQuotesList());
    });

    it('call with one random quote', function() {
      var randomQuote = quoter.askForQuote("/segdeg")
      var randomNumber = quoter.getQuotesList()[0];
      var predefinedQuote = quoter.askForQuote(`/segdeg/${randomNumber}`);
      assert.equal(randomQuote, predefinedQuote);
    });

  });

  describe('check quote file update', function() {
    it('get quotes from the quote file', function() {});
  });

  describe('check person quote function', function() {
    
    beforeEach(function() {
      quoter.emptyPersonQuoteList();
    });

    it('get quotes from person quote array', function() {
      quoter.addPersonToPersonQuoteList(1);
      quoter.addPersonToPersonQuoteList(2);
      quoter.addPersonToPersonQuoteList(3);
      assert.deepEqual([1,2,3], quoter.getPersonQuoteList());
    });

    it('get quotes from the quote file', function() {
      quoter.addPersonToPersonQuoteList(1);
      quoter.addPersonToPersonQuoteList(2);
      quoter.addPersonToPersonQuoteList(3);
      quoter.removePersonQuoteList(2);
      assert.deepEqual([1,3], quoter.getPersonQuoteList());
    });

    it('add quote to file', function() {
      quoter.addQuoteToFile("Hello World how are you?");
    });
  });

});




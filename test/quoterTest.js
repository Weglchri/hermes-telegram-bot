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
  
    it('add and remove quote from file', function() {
        var quoteList = quoter.readQuotesFile();
        var quoteListLength = Object.keys(quoteList).length;
        var quoteNumber = quoter.addQuoteToFile("Hello World how are you?");
        
        assert.equal(quoteListLength + 1, quoteNumber);
        assert.equal("Hello World how are you?", quoter.getQuote(quoteNumber));
        
        quoter.removeQuoteFromFile(quoteNumber);
        var newQuoteList = quoter.readQuotesFile();
        var newQuoteListLength = Object.keys(newQuoteList).length;
        
        assert.equal(quoteListLength, newQuoteListLength)
    });

  });

  describe('Regex data from messages', function() {

    it('regex test', function() {
      var message = '/tell This is my new quote then!';
      var newQuote = message.match(/\s(.*)/igm);
      assert.equal('This is my new quote then!', newQuote.toString().trim());
    });

    it('regex test 2', function() {
      var message2 = '/tell This is my new quote then!';
      var pattern2 = /\s(.*)/igm;
      var result = pattern2.exec(message2)[1];
      assert.equal('This is my new quote then!', result);
    });

  });

});




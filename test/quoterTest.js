'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Quote Test', function() {
  
  describe('check quote list updates', function() {
    
    beforeEach(function() {
      quoter.emptyQuotesList();
    });

    it('ask for three predefined quotes', async function() {
      await quoter.askForQuote("/quote/1");    
      await quoter.askForQuote("/quote/2");
      await quoter.askForQuote("/quote/3");
      assert.deepEqual(["1", "2", "3"], quoter.getQuotesList());
    });

    it('call with one predefined quote', async function() {
      await quoter.askForQuote("/quote/1")
      assert.equal(1, quoter.getQuotesList());
    });

    it('call with one random quote', async function() {
      var randomQuote = await quoter.getRandomQuote();
      var randomNumber = quoter.getQuotesList()[0];
      var predefinedQuote = await quoter.askForQuote(`/quote/${randomNumber}`);
      assert.equal(randomQuote, predefinedQuote);
    });

  });

  describe('check quote file update', function() {
  
    it('add and remove quote from file', async function() {
        var quoteList = await quoter.readQuotesFile();
        var quoteListLength = Object.keys(quoteList).length;
        var quoteNumber = await quoter.addQuoteToFile("Hello World how are you?");
        
        assert.equal(quoteListLength + 1, quoteNumber);
        var quote = await quoter.getQuote(quoteNumber);

        assert.equal("Hello World how are you?", quote);
        
        await quoter.removeQuoteFromFile(quoteNumber);
        var newQuoteList = await quoter.readQuotesFile();
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




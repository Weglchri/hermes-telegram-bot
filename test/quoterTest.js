'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Quote Test', function() {
  
  describe('check quote list updates', function() {
    
    beforeEach(async function() {
      quoter.emptyQuotesList();
      await quoter.executeQuoteFileUpdate();
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

    beforeEach(async function() {
      quoter.emptyQuotesList();
      await quoter.executeQuoteFileUpdate();
    });

    it('add and remove quote from file', async function() {
        var quoteList = quoter.getQuotesObject();
        var quoteListLength = Object.keys(quoteList).length;
        var quoteNumber = await quoter.addQuoteToFile("Hello World how are you?");
        
        assert.equal(quoteListLength + 1, quoteNumber);
        var quote = await quoter.getQuote(quoteNumber);

        assert.equal("Hello World how are you?", quote);
        
        await quoter.removeQuoteFromFile(quoteNumber);
        var newQuoteList = await quoter.getQuotesObject();
        var newQuoteListLength = Object.keys(newQuoteList).length;
        
        assert.equal(quoteListLength, newQuoteListLength)
    });

  });

});




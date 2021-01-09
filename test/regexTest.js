'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Regex feature test', function() {
  
  describe('Regex data from messages', function() {

    it('Regex test', function() {
      var message = '/tell This is my new quote then!';
      var newQuote = message.match(/\s(.*)/igm);
      assert.equal('This is my new quote then!', newQuote.toString().trim());
    });

    it('Regex test 2', async function() {
        var result = await quoter.getQuoteFromMessage('/tell This is my new quote then!');
        assert.equal('This is my new quote then!', result);
    });

    it('Regex test 3', async function() {
        var result = await quoter.getQuoteFromMessage('/tell ');
        assert.equal(false, result);
    });

    it('Regex test 4', async function() {
        var result = await quoter.getQuoteFromMessage('/tell tell the world this is a new quote!');
        assert.equal("tell the world this is a new quote!", result);
    });

    it('Regex test 5', async function() {
        var result = await quoter.getQuoteFromMessage('/tell');
        assert.equal(false, result);
    });

    it('Regex test 5', async function() {
        var result = await quoter.getQuoteFromMessage('/quote 3');
        assert.equal(3, result);
    });

  });

});




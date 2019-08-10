'use strict';

var assert = require('assert');
var quoter = require("../models/quoter.js");

describe('Regex Test', function() {
  
  describe('Regex data from messages', function() {

    it('regex test', function() {
      var message = '/tell This is my new quote then!';
      var newQuote = message.match(/\s(.*)/igm);
      assert.equal('This is my new quote then!', newQuote.toString().trim());
    });

    it('regex test 2', function() {
        var result = quoter.getQuoteFromMessage('/tell This is my new quote then!');
        assert.equal('This is my new quote then!', result);
    });

    it('regex test 3', function() {
        var result = quoter.getQuoteFromMessage('/tell ');
        assert.equal(false, result);
    });

    it('regex test 4', function() {
        var result = quoter.getQuoteFromMessage('/tell tell the world this is a new quote!');
        assert.equal("tell the world this is a new quote!", result);
    });

    it('regex test 5', function() {
        var result = quoter.getQuoteFromMessage('/tell');
        assert.equal(false, result);
    });

    it('regex test 5', function() {
        var result = quoter.getQuoteFromMessage('/quote 3');
        assert.equal(3, result);
    });

  });

});




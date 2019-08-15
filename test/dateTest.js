

'use strict';

var assert = require('assert');
var utils = require("../lib/utils.js");

describe('Date Test', function () {

      describe('check date functionality', function () {

            it('test parsed date format', function () {
                  var date = utils.getCurrentParsedDate();
                  assert.equal(
                        new Date(Date.now()).toISOString().substring(0,10), 
                        new Date(date).toISOString().substring(0,10)
                  );
                  assert.equal(
                        new Date(Date.now()).getHours() + 2, 
                        new Date(date).getHours()
                  );
            });


      });

});


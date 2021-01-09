
'use strict';

var utils = require("../lib/utils.js");

var storyTellers = [];

module.exports = {

    getStoryTellers: function () {
        return storyTellers;
    },
    
    addStoryTeller: function(userId) {
        storyTellers.push(userId);
    },

    deleteStoryTeller: function(userId) {
        utils.removeElementFromArray(storyTellers, userId);
    }

}
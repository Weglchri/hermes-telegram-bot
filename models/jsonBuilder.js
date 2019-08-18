'use strict';

var utils = require("../lib/utils.js");

module.exports = class JsonBuilder {
    
    constructor() {}

    addQuote(quote) {
        this.quote = quote;
        return this;
    }

    addFullName(fullName) {
        this.fullName = fullName;
        return this;
    }

    addUserId(userId) {
        this.userId = parseInt(userId);
        return this;
    }

    addDate() {
        this.newDate = new Date();
        return this;
    }

    addMetadata() {

        if(this.fullName === undefined || this.newDate === undefined || this.userId === undefined) {
            console.log("author, date or userId invalid");
            return 'invalid metadata';
        }

        var metadata = {
            "userId" : this.userId,
            "author" : this.fullName,
            "date" : this.newDate
        }
        
        this.metadata = metadata;
        return this;
    }

    buildJSONObject() {

        if(this.quote === undefined || this.metadata === undefined) {
            console.log("quote or metadata invalid");
            return 'invalid data';
        }

        var jsonObject = {
            "quote" : this.quote,
            "metadata" : this.metadata
        }

        return jsonObject;
    }
    
}


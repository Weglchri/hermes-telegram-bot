'use strict';

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
        this.userId = userId;
        return this;
    }

    addDate() {
        this.newDate = new Date(Date.now()).toISOString();
        return this;
    }

    addMetadata() {
        
        if(this.fullName === undefined || this.newDate === undefined || this.userId === undefined) {
            console.log("author, date or userId invalid");
            return 'invalid metadata';
        }

        var metadata = {
            "author" : this.fullName,
            "userId" : this.userId,
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


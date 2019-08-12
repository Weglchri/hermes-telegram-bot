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

    addDate() {
        this.newDate = new Date(Date.now()).toISOString().substring(0,10);
        return this;
    }

    addMetadata() {
        
        if(this.fullName === undefined || this.newDate === undefined) {
            console.log("author or date invalid");
            return 'invalid data';
        }

        var metadata = {
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


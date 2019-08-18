'use strict';

const STATUS = {
    PENDING: "PENDING",
    APPROVED: "APPROVED",
    DELETED: "DELETED"
}

class JsonBuilder {

    constructor() { }

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

    addStatus(status) {
        this.status = status;
        return this;
    }

    addApprovals() {
        this.approvals = [];
        return this;
    }

    addMetadata() {

        if (!this.fullName || !this.newDate || !this.userId ) {
            console.log("author, date, status or userId not set");
            return false;
        }

        var metadata = {
            "userId": this.userId,
            "author": this.fullName,
            "date": this.newDate,
        }

        this.metadata = metadata;
        return this;
    }

    buildJSONObject() {

        if (!this.quote || !this.metadata || !this.status || !this.approvals) {
            console.log("quote, status, approvals or metadata not set");
            return false;
        }

        var jsonObject = {
            "quote": this.quote,
            "metadata": this.metadata,
            "approvals": this.approvals,
            "status": this.status
        }

        return jsonObject;
    }

}

module.exports = { JsonBuilder, STATUS };

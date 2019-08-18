'use strict';
const fs = require('fs');

module.exports = {

    getRandomInt: function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    removeElementFromArray: function (arr, value) {
        return arr.filter(function (ele) {
            return ele != value;
        });
    },

    readFileAsJSONObject: function (pathToFile) {
        const data = fs.readFileSync(pathToFile);
        const parsedData = JSON.parse(data);
        return parsedData;
    },

    readFileAsString: function (pathToFile) {
        const rawData = fs.readFileSync(pathToFile);
        return rawData;
    },

    writeFile: function (dest, data) {
        fs.writeFileSync(dest, data);
    },

    copyFiles: function (src, dest) {
        fs.copyFile(src, dest, (err) => {
            if (err) {
                throw err;
            }
            console.log('src was copied to dest');
        })
    },

    extractElementFromMessage: async function (message) {
        var pattern = /\s(.*)/igm;
        var element = pattern.exec(message);
        if (element !== null && element.length == 2 && element[1] != '')
            return element[1]
        else
            return false;
    },

    listDisplayer: async function (quoteObject) {
        var stringList = '';
        Object.entries(quoteObject).forEach(
            function([key, value]) {
                // here goes the logic for evaluation which user gets what prefix
                stringList = stringList.concat(`${key}: \t ${value.quote} \n`);
            }
        );
        return stringList;
    }


}





'use strict';
const fs = require('fs');

module.exports = {
    
    getRandomInt : function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    removeElementFromArray : function(arr, value) {
        return arr.filter(function(ele){
            return ele != value;
        });
     },

    readFileAsJSONObject : function(pathToFile) {
        const data = fs.readFileSync(pathToFile);
        const parsedData = JSON.parse(data);
        return parsedData;
    },

    readFileAsString: function(pathToFile) {
        const rawData = fs.readFileSync(pathToFile);
        return rawData;
    },

    writeFile : function(dest, data) {
        fs.writeFileSync(dest, data);
    },

    copyFiles : function(src, dest) {
        fs.copyFile(src, dest, (err) => {
            if (err) {
                throw err;
            } 
            console.log('src was copied to dest');
        })
    },

    getLastObjectElement : function(obj) {
        return  parseInt(Object.keys(obj).pop());
    }

}





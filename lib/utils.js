'use strict';
const fs = require('fs');

module.exports = {
    
    getRandomInt : function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    readFile : function(pathToFile) {
        const data = fs.readFileSync(pathToFile);
        const parsedData = JSON.parse(data);
        return parsedData;
    },

    copyFiles : function(src, dest) {
        fs.copyFile(src, dest, (err) => {
            if (err) {
                throw err;
            } 
            console.log('src was copied to dest');
        })
    }

}





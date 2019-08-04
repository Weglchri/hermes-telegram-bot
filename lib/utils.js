'use strict';
const fs = require('fs');

module.exports = {
    
    getRandomInt : function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    },

    readFile : function(pathToFile) {
        return fs.readFileSync(pathToFile);
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





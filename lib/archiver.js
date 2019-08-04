'use strict';

var utils = require("./utils.js");
const path = require('path');
const util = require('util');
const fs = require('fs');

const copyFilePromise = util.promisify(fs.copyFile);
const getFilePromise = util.promisify(fs.readdir);

module.exports = {

    copyTelegramFiles : function(srcDir, destDir, files) {
        return Promise.all(files.map(file => {
            return copyFilePromise(path.join(srcDir, file), path.join(destDir, file));
        }));
    },

    getAllFilesFromSource : function (srcDir) {
        var filenamesList = [];
        const pattern = /.+((jpg)|(png)|(mp3)|(mp4))$/;
        return new Promise(function(resolve, reject) {
            fs.readdir(srcDir, function(err, filenames){
                filenames.forEach(function (file) {
                    if(file.match(pattern)) 
                        filenamesList.push(file);
                });
                if (err) 
                    reject(err); 
                else 
                    resolve(filenamesList);
            });
        });
    },
}

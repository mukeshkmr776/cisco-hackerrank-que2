const fs = require('fs');
const path = require('path');

function getStats(path) {
    return fs.statSync(path);
}

function getCreatedDate(date) {
    return (new Date(date).toISOString().split('T'))[0].split('-').reverse().join('-')
}

function getFileMetadata(file, name, pathName) {
    return {
        "fileName" : path.basename(name), //name of the file
        "filePath" : '/' + path.relative(__dirname, path.join(pathName, name)), //path to the file relative to the root of the project
        "size" : file.size, //size of the file in bytes
        "createdAt" : getCreatedDate(file.ctimeMs), // date when the file was created in the format YYYY-MM-DD. The date should be normalized to UTC.
        "isDirectory" : file.isDirectory() // whether the path is a directory (Boolean)
      }
}

function sortByName(file1, file2) {
    if (file1.fileName < file2.fileName) {
      return -1;
    }
    if (file1.fileName > file2.fileName) { 
      return 1;
    }
    return 0;
}

const main = (dirOrFilePath) => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(dirOrFilePath)) {
            reject(new Error('Invalid Path'));
        }

        const dirOrFilePathStats = getStats(dirOrFilePath);
        const result = [];

        if (dirOrFilePathStats.isFile()) { // If file
            result.push(getFileMetadata(dirOrFilePathStats, dirOrFilePath, ''));
            resolve(result.sort(sortByName));
        } else { // If directory
            const allContent = fs.readdirSync(dirOrFilePath);
            allContent.forEach(item => {
                const fileMetaData = getFileMetadata(getStats(path.join(dirOrFilePath, item)), item, dirOrFilePath);
                result.push(fileMetaData);
            });
            resolve(result.sort(sortByName));
        }
    })
};


module.exports = main;

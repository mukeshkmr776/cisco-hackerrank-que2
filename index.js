const fs = require('fs');
const path = require('path');

const main = () => {
    return new Promise((resolve, reject) => {
        if(!fs.existsSync(dirOrFilePath)) {
            reject(new Error('Invalid Path'));
        }
        
        const dirOrFilePathStats = getStats(dirOrFilePath);
        const result = [];
        
        if (dirOrFilePathStats.isFile()) { // If file
            result.push(getFileMetadata(dirOrFilePathStats, dirOrFilePath, ''));
        } else { // If directory
            const allContent = fs.readdirSync(dirOrFilePath);
            allContent.forEach(item => {
                const fileMetaData = getFileMetadata(getStats(path.join(dirOrFilePath, item)), item, dirOrFilePath);
                result.push(fileMetaData);
            });
        }

        resolve(result);
    })
};


function getStats(path) {
    return fs.statSync(path);
}

function getCreatedDate(date) {
    return (date.toISOString().split('T'))[0]
}

function getFileMetadata(file, name, pathName) {
    console.log(name, pathName);
    return {
        "fileName" : name, //name of the file
        "filePath" : path.relative(__dirname, path.join(pathName, name)), //path to the file relative to the root of the project
        "size" : file.size, //size of the file in bytes
        "createdAt" : getCreatedDate(file.birthtime), // date when the file was created in the format YYYY-MM-DD. The date should be normalized to UTC.
        "isDirectory" : file.isDirectory() // whether the path is a directory (Boolean)
      }
}


module.exports = main;

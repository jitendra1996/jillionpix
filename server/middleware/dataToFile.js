const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'models', 'data.json');

module.exports = (incomingData) => {
    fs.readFile(filePath, (err, comingDataFromFile) => {
        if (err) {
            const arr = [];
            arr.push(incomingData);
            fs.writeFile(filePath, JSON.stringify(arr), (err) => {
                if (err) {
                    console.log('data to file 1st error : ', err);
                }
            });
            return;
        }
        const fileData = comingDataFromFile.toString();
        const fileDataParses = JSON.parse(fileData);
        const convertIntoArr = [...fileDataParses, incomingData];
        fs.writeFile(filePath, JSON.stringify(convertIntoArr), err => {
            if (err) {
                console.log('error 2 datatofile : ', err);
            }
        });
    });
}

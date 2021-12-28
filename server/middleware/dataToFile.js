const fs = require('fs');
const path = require('path');
const delDriveFile = require('./delDriveFile');
const sendFileToDrive = require('./sendFileToDrive');

const filePath = path.join(__dirname,'..','models','data.json');

module.exports = (incomingData) => { 
    fs.readFile(filePath , (err , comingDataFromFile) => {
    if(err){
        const arr = [];
        arr.push(incomingData);
        fs.writeFile(filePath, JSON.stringify(arr) ,(err) =>{
            if(err){
                console.log('data to file 1st error : ',err);
            }
        });
        sendFileToDrive('userData.json',path.join(__dirname,'..','models','data.json'),process.env.USER_FOLDER_ID,'text/json');   
        return;
    }
    const fileData = comingDataFromFile.toString();
    const fileDataParses = JSON.parse(fileData);
    const convertIntoArr = [...fileDataParses , incomingData];
    fs.writeFile(filePath , JSON.stringify(convertIntoArr), err =>{
        if(err){
            console.log('error 2 fatatofile : ',err);
        }
    });
    delDriveFile();
    sendFileToDrive('userData.json',path.join(__dirname,'..','models','data.json'),process.env.USER_FOLDER_ID,'text/json');
});
}

const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token : process.env.REFRESH_TOKEN});

const drive = google.drive({
    version : 'v3',
    auth : oauth2Client
});

const filePath = path.join(__dirname,'..','models','fileId.txt');

module.exports = () =>{
    try{
        fs.readFile(filePath ,async (err , data) => {
            const id = data.toString();
            const response =await drive.files.delete({
                fileId : id
            });
        }); 
    }catch (error){
        console.log(error.message)
    }
}
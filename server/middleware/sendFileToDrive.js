const path = require('path');
const fs = require('fs');
const {google} = require('googleapis');

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


module.exports = async (fileName , filePath , folderId , fileFormate) => {
    try{
        const fileMetadata = {
            name: `${fileName}`,
            parents: [folderId]
          };
        const response = await drive.files.create({
            resource : fileMetadata,
            media : {
                mimeType : fileFormate,
                body : fs.createReadStream(filePath)
            },
            fields : 'id'
        });

        //if mimetype is 'text/json' then store id of json file to fileId.txt
        if(fileFormate === 'text/json'){
            fs.writeFile(path.join(__dirname,'..','models','fileId.txt'), `${response.data.id}` , err => { if(err){console.log('error from fs sendfiletodrive :', err)};});
        }
    }catch{
        console.log('error from catch sendfiletodrive : ',error.message);
    }
}

import  { google }  from 'googleapis';

import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const CLIENT_ID = '347429567884-0s07gp77akraracmk3ngs70iq0igvp3r.apps.googleusercontent.com';
const CLIENT_SECRET = 'MVbA14VYBILpU28xpVA8kHkq';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

const REFRESH_TOKEN = '1//04NpFvC5wTiGOCgYIARAAGAQSNwF-L9IrQ-86S0THs-3yXG-pQXRO8XyTRaehM-cCh0SI7LJT4gLz4MIWAmNS_TbrCEayQrj2-5c';

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
  version: 'v3',
  auth: oauth2Client,
});

/* 
filepath which needs to be uploaded
Note: Assumes example.jpg file is in root directory, 
though this can be any filePath
*/
const filePath = path.join(__dirname, 'myfile.zip');
const folder="15ONd_1kHogVi-_gglw2sxZcbCOVVjuLJ"

async function uploadFile() {
    var folderId = folder;
    var fileMetadata = {
      'name': 'myZipFile.zip',
      parents: [folderId]
    };
    var media = {
      mimeType: 'file/zip',
      body: fs.createReadStream(filePath)
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('File Id: ', file.data.id);
      }
    });
}

uploadFile();


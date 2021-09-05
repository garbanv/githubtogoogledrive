import express from 'express'
const app = express()
const port = process.env.PORT || 3000;
app.use(express.static('static'));
import dotenv from 'dotenv'
dotenv.config()
import  { google }  from 'googleapis';
import schedule from 'node-schedule'
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from "@octokit/rest";




app.listen(port,()=>{
  console.log("app running on port: "+port)
})



app.get("/",(req,res)=>{res.send("Github")})


/* GET DATE */
const d = new Date();
const date = d.toLocaleDateString();
const file=`${date.toString()}-coronavirus-master.zip`;
const owner ="nychealth"
const repo="coronavirus-data"
const ref="master"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* SET HOUR TO RUN FUNCTION */
const rule = new schedule.RecurrenceRule();
rule.hour=20
rule.minute = 50;


/* REPEATED FUNCTION */
const job = schedule.scheduleJob(rule, async function(){
const octokit = new Octokit();

  /* GET REPO DATA */  
  const repoData = await octokit.rest.repos.downloadZipballArchive({
    owner,
    repo,
    ref,
  });

/* CONVERT DATA TO FILE */
const buffer = await Buffer.from(repoData.data);

const data = await fs.writeFileSync(path.join(__dirname,"static","coronavirus-master.zip"), buffer, function (err) {
  if (err) throw err;
  console.log('Saved!');
});





/* CONNECT GOOGLE API */

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

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


const filePath = path.join(__dirname, 'coronavirus-master.zip');
const folder=process.env.FOLDER


async function uploadFile() {
    var folderId = folder;
    var fileMetadata = {
      'name': file,
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

if(data===undefined){

uploadFile();
}
 
});


  







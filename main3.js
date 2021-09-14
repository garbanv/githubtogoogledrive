import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Octokit } from "@octokit/rest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const owner ="nychealth"
const repo="coronavirus-data"
const ref="master"

console.log(__dirname)

const octokit = new Octokit();

  /* GET REPO DATA */  
  const repoData = await octokit.rest.repos.downloadZipballArchive({
    owner,
    repo,
    ref,
  });

/* CONVERT DATA TO FILE */
const buffer = await Buffer.from(repoData.data);

const data = await fs.writeFileSync(path.join(__dirname,"static","coronaviruss-master.zip"), buffer, function (err) {

  if (err) throw err;
  if(undefined){
    console.log('Saved!');
  } else {console.log(data)}
  
});
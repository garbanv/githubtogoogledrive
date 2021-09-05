import fetch from 'node-fetch';

import fs from 'fs'
import { Octokit } from "@octokit/rest";
const octokit = new Octokit({ auth: `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` });



const owner ="nychealth"
const repo="coronavirus-data"
const ref="master"

const test = await octokit.rest.repos.downloadZipballArchive({
    owner,
    repo,
    ref,
  });


const buffer = await Buffer.from(test.data);

const data = await fs.writeFileSync('myfile.zip', buffer, function (err) {
  if (err) throw err;
  console.log('Saved!');
});
  
console.log("data",data);




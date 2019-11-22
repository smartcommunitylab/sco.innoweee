// import { writeFile } from 'fs';
// import { argv } from 'yargs';
var fs = require("fs");
var yargs = require("yargs");
// This is good for local dev environments, when it's better to
// store a projects environment variables in a .gitignore'd file
require('dotenv').config();

// Would be passed to script like this:
// `ts-node set-env.ts --environment=dev`
// we get it from yargs's argv object
const environment = yargs.argv.environment;
const isProd = environment === 'prod';

const targetPath = `./src/environments/environment.${environment}.ts`;
const envConfigFile = `
export const environment = {
  production: ${isProd},
  apiEndpoint: "${process.env.apiEndpoint}",
    getDomainApi: "${process.env.getDomainApi}",
    getInstituteApi: "${process.env.getInstituteApi}",
    getSchoolApi: "${process.env.getSchoolApi}",
    getGameApi: "${process.env.getGameApi}",
    getPlayerApi: "${process.env.getPlayerApi}",
    getMaterialApi: "${process.env.getMaterialApi}",
    getCatalogApi: "${process.env.getCatalogApi}",
    getCollection: "${process.env.getCollection}",
    buyComponentApi: "${process.env.buyComponentApi}",
    contributionApi: "${process.env.contributionApi}",
    robotApi: "${process.env.robotApi}",
    getRobotImageApi: "${process.env.getRobotImageApi}",
    getItemApi: "${process.env.getItemApi}",
    getReduceApi: "${process.env.getReduceApi}",
    itemSocketURL: "${process.env.itemSocketURL}",
    getDeliveryApi: "${process.env.getDeliveryApi}",
    getGarbageApi: "${process.env.getGarbageApi}",
    getUsedApi: "${process.env.getUsedApi}",
    aacClientId: "${process.env.aacClientId}",
    redirectUrl: "${process.env.redirectUrl}",
    scope: "${process.env.scope}",
    aacUrl: "${process.env.aacUrl}",
  superSecretKey: "${process.env.superSecretKey}",
  superDoubleSecret: "${process.env.superDoubleSecret}" 
};
`

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});

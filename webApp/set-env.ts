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
    aacClientId: "${process.env.aacClientId}",
    redirectUrl: "${process.env.redirectUrl}",
    aacUrl: "${process.env.aacUrl}",
    getDomainApi: 'api/profile',
    getInstituteApi: 'api/institute',
    getSchoolApi: 'api/school',
    getGameApi: 'api/game/',
    getPlayerApi: 'api/player',
    getMaterialApi:'/link',
    getCatalogApi:'api/catalog',
    getCollection: 'api/collection/',
    buyComponentApi:'/buy/',
    contributionApi:'/contribution/',
    robotApi:"/robot/",
    getRobotImageApi:"api/image/robot",
    getItemApi:"api/item",
    getConfirmApi:"api/item/confirm",
    getReduceApi:"/reduce",
    itemSocketURL:"itemws",
    getDeliveryApi:"/delivery",
    getGarbageApi:"api/garbageMap/",
    getUsedApi:"/used",
    scope: 'openid profile email profile.basicprofile.me',
    implicit_identity_client: '${process.env.aacClientId}',
    implicit_identity_server: '${process.env.aacUrl}',
    implicit_redirect_url: '${process.env.redirectUrl}',
    implicit_scopes: 'openid profile email profile.basicprofile.me',
    implicit_end_session_redirect_url: '${process.env.redirectUrl}/logout',
  };
`

fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Output generated at ${targetPath}`);
});

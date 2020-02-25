// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  appName: 'InnoWee',
    apiEndpoint: 'https://dev.smartcommunitylab.it/innoweee-engine/',
    getDomainApi: 'api/profile',
    getInstituteApi: 'api/institute/',
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
    getReduceApi:"/reduce",
    getConfirmApi:"api/item/confirm",
    itemSocketURL:"itemws",
    getDeliveryApi:"/delivery",
    getGarbageApi:"api/garbageMap/",
    getUsedApi:"/used",
    aacClientId: "2c53f587-693c-48fa-b579-65506d8d3221",
    redirectUrl: 'http://localhost:8100/',
    scope: 'openid profile email profile.basicprofile.me',
    aacUrl: 'https://aac.platform.smartcommunitylab.it/aac'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

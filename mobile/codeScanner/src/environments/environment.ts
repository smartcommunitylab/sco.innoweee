// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
export const environment = {
  production: false,
  appName: 'InnoWee',
    apiEndpoint: 'https://dev.smartcommunitylab.it/innoweee-engine/',
    getDomainApi: 'api/profile',
    getInstituteApi: '/api/institute/',
    getSchoolApi: 'api/school',
    getGameApi: 'api/game/',
    getPlayerApi: 'api/player',
    getMaterialApi:'/link',
    getCatalogApi:'api/catalog',
    getCollection: 'api/collection/',
    buyComponentApi:'/buy/',
    contributionApi:'/contribution/',
    robotApi:"/robot/",
    getRobotImageApi:"api/image/robot/",
    getItemApi:"api/item",
    getReduceApi:"/reduce",
    itemSocketURL:"itemws",
    getDeliveryApi:"/delivery",
    getGarbageApi:"api/garbageMap/",
    getUsedApi:"/used",
    aacClientId: "2be89b9c-4050-4e7e-9042-c02b0d9121c6",
    redirectUrl: 'https://localhost:8100/',
    scope: 'profile.basicprofile.me profile.accountprofile.me',
    aacUrl: 'https://am-dev.smartcommunitylab.it/aac/'
};
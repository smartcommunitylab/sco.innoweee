import { InjectionToken } from '@angular/core';
export interface ApplicationConfig {
    appName: string;
    apiEndpoint: string;
    getDomainApi: string;
    getInstituteApi: string;
    getSchoolApi: string;
    getGameApi: string;
    getPlayerApi: string;
    getMaterialApi:string;
    getCatalogApi:string;
    buyComponentApi:string;
    robotApi:string;
    getRobotImageApi:string;
    getItemApi:string;
    getReduceApi:string;
    itemSocketURL:string;
    getDeliveryApi:string;
    getGarbageApi:string;
    getUsedApi:string;
    aacClientId:string;
    getCollection:string;
    redirectUrl:string;
    scope:string;
    aacUrl:string;
    contributionApi:string;
}

// Configuration values for our app
export const APP_CONFIG: ApplicationConfig = {
    appName: 'InnoWee',
    // apiEndpoint: 'http://192.168.42.60:2020/',
    // apiEndpoint: 'https://tn.smartcommunitylab.it/innoweee-engine/',
    apiEndpoint: 'https://innoweee.platform.smartcommunitylab.it/innoweee-engine/',
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
    redirectUrl: 'http://localhost:8100/',
    scope: 'profile.basicprofile.me profile.accountprofile.me',
    aacUrl: 'https://am-dev.smartcommunitylab.it/aac/'


};

// Create a config token to avoid naming conflicts
export const APP_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

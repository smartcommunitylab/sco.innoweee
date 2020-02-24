import { InjectionToken } from '@angular/core';
export interface ApplicationConfig {
  getReportApi: string;
    appName: string;
    apiEndpoint: string;
    getDomainApi: string;
    getInstituteApi: string;
    getSchoolApi: string;
    getGameApi: string;
    getCollectorApi: string;
    getCollectionApi:string;
    getPlayerApi: string;
    getMaterialApi:string;
    getCatalogApi:string;
    buyComponentApi:string;
    robotApi:string;
    getRobotImageApi:string;
    itemApi:string;
    getItemApi:string;
    getFindApi:string;
    getReduceApi:string;
    itemSocketURL:string;
    getDeliveryApi:string;
    getGarbageApi:string;
    getRecognizedApi:string;
    getUsedApi:string;
    parentApi:string;
}

// Configuration values for our app
export const APP_CONFIG: ApplicationConfig = {
    appName: 'InnoWee',
     apiEndpoint: 'https://innoweee.platform.smartcommunitylab.it/innoweee-engine/',
    // apiEndpoint: 'https://dev.smartcommunitylab.it/innoweee-engine/',
    // apiEndpoint: 'http://192.168.42.60:2020/',
    getDomainApi: 'api/profile',
    getInstituteApi: 'api/institute',
    getCollectorApi: 'api/collector',
    getCollectionApi:'api/collection/',
    getFindApi: '/find',
    getSchoolApi: 'api/school',
    getGameApi: 'api/game/',
    getPlayerApi: 'api/player',
    getMaterialApi:'/link',
    getCatalogApi:'api/catalog',
    buyComponentApi:'/buy/',
    robotApi:"/robot/",
    getRobotImageApi:"api/image/robot/",
    getItemApi:"api/item",
    getReduceApi:"/reduce",
    itemSocketURL:"itemws",
    getDeliveryApi:"/delivery",
    getGarbageApi:"api/garbageMap/",
    getRecognizedApi:"recognized",
    getUsedApi:"/used",
    getReportApi:"report",
    parentApi:"/parent",
    itemApi: '/item',

};

// Create a config token to avoid naming conflicts
export const APP_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

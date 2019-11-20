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
    getRecognizedApi:string;
    getUsedApi:string;
}

// Configuration values for our app
export const APP_CONFIG: ApplicationConfig = {
    appName: 'InnoWee',
    apiEndpoint: 'https://innoweee.platform.smartcommunitylab.it/innoweee-engine/',
    // apiEndpoint: 'http://192.168.42.60:2020/',
    getDomainApi: 'api/profile',
    getInstituteApi: 'api/institute',
    getSchoolApi: 'api/school',
    getGameApi: 'api/game/',
    getPlayerApi: 'api/player',
    getMaterialApi:'/link',
    getCatalogApi:'api/catalog',
    buyComponentApi:'/buy/',
    robotApi:"/robot/",
    getRobotImageApi:"api/image/robot/",
    getItemApi:"api/item/",
    getReduceApi:"/reduce",
    itemSocketURL:"itemws",
    getDeliveryApi:"/delivery",
    getGarbageApi:"api/garbageMap/",
    getRecognizedApi:"recognized",
    getUsedApi:"/used"
};

// Create a config token to avoid naming conflicts
export const APP_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

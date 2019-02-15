import { InjectionToken } from '@angular/core';
export interface ApplicationConfig {
    appName: string;
    apiEndpoint: string;
    getDomainApi: string;
    getInstituteApi: string;
    getSchoolApi: string;
    getGameApi: string;
    getPlayerApi: string;
}

// Configuration values for our app
export const APP_CONFIG: ApplicationConfig = {
    appName: 'InnoWee',
    apiEndpoint: 'http://192.168.42.60:2020/',
    getDomainApi: 'api/profile',
    getInstituteApi: '/api/institute/',
    getSchoolApi: 'api/school',
    getGameApi: 'api/game',
    getPlayerApi: 'api/player'
};

// Create a config token to avoid naming conflicts
export const APP_CONFIG_TOKEN = new InjectionToken<ApplicationConfig>('config');

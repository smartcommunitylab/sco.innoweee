import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
import { config } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  endPoint = "";
  getGameApi = "";
  getMaterialApi = "";
  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
    this.getMaterialApi = config.getMaterialApi;
    this.getGameApi = config.getGameApi;
    this.endPoint = config.apiEndpoint;
  }

  getMaterial(gameId): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + this.getMaterialApi;
    return this.http.get(url).toPromise().then(response => {
      return response
    }).catch(response => {
      return this.handleError(response)
    });
  }

  
  private handleError(error: any): Promise<any> {

    return new Promise<string>((resolve, reject) => {
      console.error('An error occurred', error);

      if ((error.status == 401) || (error.status == 403)) {
        // display toast and redirect to logout.
        var errorObj = JSON.parse(error._body)
        var errorMsg = 'Per favore accedi di nuovo.';
        if (errorObj.errorMsg) {
          errorMsg = errorObj.errorMsg;
        }
      } else {
        Promise.reject(error);
      }
    });

  }
}

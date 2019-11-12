import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class DataServerService {
  endPoint: any;
  getItemApi: any;
  getRecognizedApi: any;
  getUsedApi: any;
  sendItem(id: string, playerId: string, token): any {
    let url: string = this.endPoint + this.getItemApi +  this.getRecognizedApi;

    let body = {
      "itemId": id,
      "playerId": playerId
    }
    return this.http.post(url, body,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(res => {
      return res

    }).catch(response => {
      return this.handleError(response)
    });

  }
  constructor(private http: HttpClient,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
      this.endPoint=config.apiEndpoint;
      this.getItemApi=config.getItemApi;
      this.getRecognizedApi=config.getRecognizedApi;
      this.getUsedApi = config.getUsedApi;
  }

  checkIfPresent(id: string, idUser:string, token): Promise<any> {
    let url: string = this.endPoint + this.getItemApi + this.getUsedApi+"?playerId="+idUser+"&itemId="+encodeURIComponent(id);

    return this.http.get( url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(res => {
      return res

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

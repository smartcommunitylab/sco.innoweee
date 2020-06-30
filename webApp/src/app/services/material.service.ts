import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { config } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  endPoint = "";
  getGameApi = "";
  getMaterialApi = "";
  constructor(
    private http: HttpClient) {
    this.getMaterialApi = environment.getMaterialApi;
    this.getGameApi = environment.getGameApi;
    this.endPoint = environment.apiEndpoint;
  }

  getMaterial(gameId,token): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + this.getMaterialApi;
    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
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

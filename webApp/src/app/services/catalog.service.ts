import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  endPoint = "";
  getCatalogApi = "";
  buyComponentApi = "";
  robotApi="";
  getGameApi="";
  
  constructor(
    private http: HttpClient) {
      this.getCatalogApi = environment.getCatalogApi;
      this.robotApi = environment.robotApi;
      this.getGameApi = environment.getGameApi;
      this.buyComponentApi = environment.buyComponentApi;
      this.endPoint = environment.apiEndpoint;
  }

  /*
  
  get the list with all the components
  
  */
  getCatalog(tenantId): Promise<any> {
    let url: string = this.endPoint + this.getCatalogApi+'/'+tenantId;

    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response)
    });
  }



  buyComponent(item,gameId,playerId): Promise<any> {

// /api/game/{gameId}/robot/{playerId}/buy/{componentId}
    let url: string = this.endPoint +this.getGameApi+ gameId+ this.robotApi+playerId+ this.buyComponentApi+item.componentId;

    return this.http.get(url).toPromise().then(response => {
      return response;
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

import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
import { HttpClient } from '@angular/common/http';




@Injectable({
  providedIn: 'root'
})
export class GarbageCollectionService {
  endPoint;
  getGameApi;
  actualCollection:any;
  getItemApi: string;
  getReduceApi: string;
  getDeliveryApi:string;
  getGarbageApi:string;
  getUsedApi: any;
  geCollectionApi: string;

  arrayResources = [
    "plastic",
    "glass",
    "iron",
    "aluminium",
    "copper",
    "nickel",
    "platinum",
    "tin",
    "silver",
    "gold"
  ]
  constructor(private http: HttpClient,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
      this.endPoint = config.apiEndpoint;
      this.getGameApi = config.getGameApi;
      this.getItemApi = config.getItemApi;
      this.getReduceApi = config.getReduceApi;
      this.getDeliveryApi = config.getDeliveryApi;
      this.getGarbageApi = config.getGarbageApi;
      this.getUsedApi = config.getUsedApi;
      this.geCollectionApi = config.getCollection;
   }
   getArrayResources():any[] {
     return this.arrayResources;
   }
   getActualCollection(gameId): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + '/collection';
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }
  
  getCollections(gameId): Promise<any> {
    let url: string = this.endPoint + this.geCollectionApi  +gameId  ;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }
  checkIfPresent(id: string, idUser:string): Promise<any> {
    let url: string = this.endPoint + this.getItemApi + this.getUsedApi+"?playerId="+idUser+"&itemId="+encodeURIComponent(id);

    return this.http.get( url).toPromise().then(res => {
      return res;

    }).catch(response => {
      return this.handleError(response)
    });


  }
  getGargabeMap(tenantId): Promise<any> {
    let url: string = this.endPoint + this.getGarbageApi + tenantId ;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }
  reduce(playerId,coins): Promise<any> {
    let url: string = this.endPoint + this.getItemApi+this.getReduceApi;
    let body = {
      playerId:playerId,
      reduceCoin:coins
    }    
    return this.http.post(url,body).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }

  itemDelivery(item): Promise<any> {
    let url: string = this.endPoint + this.getItemApi+this.getDeliveryApi;
    let body = item;    
    return this.http.post(url,body).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
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

import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';




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
  getConfirmApi:string;

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
    private utils:UtilsService) {
      this.endPoint = environment.apiEndpoint;
      this.getGameApi = environment.getGameApi;
      this.getItemApi = environment.getItemApi;
      this.getReduceApi = environment.getReduceApi;
      this.getDeliveryApi = environment.getDeliveryApi;
      this.getGarbageApi = environment.getGarbageApi;
      this.getUsedApi = environment.getUsedApi;
      this.geCollectionApi = environment.getCollection;
      this.getConfirmApi = environment.getConfirmApi;
   }
   getArrayResources():any[] {
     return this.arrayResources;
   }
   getCredit(gameId: any, objectId: any):Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + this.getReduceApi+'/'+objectId;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
    });
  }
   getActualCollection(gameId): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + '/collection';
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
    });
  }
  
  getCollections(gameId): Promise<any> {
    let url: string = this.endPoint + this.geCollectionApi  +gameId  ;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
    });
  }
  checkIfPresent(id: string, idUser:string): Promise<any> {
    let url: string = this.endPoint + this.getItemApi + this.getUsedApi+"?playerId="+idUser+"&itemId="+encodeURIComponent(id);

    return this.http.get( url).toPromise().then(res => {
      return res;

    }).catch(response => {
      return this.utils.handleError(response)
    });


  }
  confirmItem(id: string, idUser:string): Promise<any> {
    let url: string = this.endPoint + this.getConfirmApi + "?itemId="+id+"&playerId="+idUser;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
    });
  }
  getGargabeMap(tenantId): Promise<any> {
    let url: string = this.endPoint + this.getGarbageApi + tenantId ;
    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
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
      return this.utils.handleError(response);
    });
  }

  itemDelivery(item): Promise<any> {
    let url: string = this.endPoint + this.getItemApi+this.getDeliveryApi;
    let body = item;    
    return this.http.post(url,body).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.utils.handleError(response);
    });
  }
  


}

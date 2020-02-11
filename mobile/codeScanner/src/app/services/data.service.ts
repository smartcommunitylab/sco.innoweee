import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
const ERROR_PLAYERID_WRONG = 'EC12:playerId not corresponding';

@Injectable({
  providedIn: 'root'
})
export class DataServerService {

  
  
  endPoint: any;
  getItemApi: any;
  getRecognizedApi: any;
  getUsedApi: any;
  getGameApi: any;
  getGarbageApi: string;
  getDeliveryApi:string;
  getReportApi: string;
  getPlayerApi: string;
  getCollectorApi: string;
  itemApi: string;



  
  constructor(private http: HttpClient,
    private translate:TranslateService,
    private alertController:AlertController,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
      this.endPoint=config.apiEndpoint;
      this.getItemApi=config.getItemApi;
      this.getRecognizedApi=config.getRecognizedApi;
      this.getUsedApi = config.getUsedApi;
      this.getDeliveryApi = config.getDeliveryApi;
      this.getGameApi = config.getGameApi;
      this.getGarbageApi = config.getGarbageApi;
      this.getReportApi = config.getReportApi;
      this.getPlayerApi = config.getPlayerApi;
      this.getCollectorApi= config.getCollectorApi;
      this.getCollectorApi= config.getCollectorApi;
      this.itemApi = config.itemApi;

  } 

  findItem(itemId: any, tenantID: any, token: string) {
    ///api/collector/item/{tenantId}/find
    let url: string = this.endPoint + this.getCollectorApi +'/'+ this.itemApi+'/'+tenantID+'/find?itemId='+ itemId;
    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });   }

  getStat(playerId: string, token: any) {
    // @GetMapping(value = "/api/player/{playerId}/report")

    let url: string = this.endPoint + this.getPlayerApi +'/'+ playerId+'/'+this.getReportApi ;
    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });    }
  itemDelivery(item,token): Promise<any> {
    let url: string = this.endPoint + this.getItemApi+this.getDeliveryApi;
    let body = item;    
    return this.http.post(url,body,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }

  sendItem(id: string, playerId: string, token): any {
    let url: string = this.endPoint + this.getItemApi +"/"+  this.getRecognizedApi;

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
  getGargabeMap(tenantId, token): Promise<any> {
    let url: string = this.endPoint + this.getGarbageApi + tenantId ;
    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
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
   getActualCollection(gameId, token): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId + '/collection';
    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }}).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }

  private handleError(error: any): Promise<any> {

    return new Promise<string>((resolve, reject) => {
      console.error('An error occurred', error);

      // if ((error.status == 401) || (error.status == 403)) {
      //   // display toast and redirect to logout.
      //   var errorObj = JSON.parse(error._body)
      //   var errorMsg = 'Per favore accedi di nuovo.';
      //   if (errorObj.errorMsg) {
      //     errorMsg = errorObj.errorMsg;
      //   }
      // } else {
        if (error.error && error.error.errorMsg == ERROR_PLAYERID_WRONG) {
          this.translate.get('alert_different_class_title').subscribe(async (res: string) => {
            var message = this.translate.instant('alert_different_class_message');
            var buttoncancel = this.translate.instant('cancel_popup');
            const alert = await this.alertController.create({
              header: res,
              message: message,
              backdropDismiss: false,
              buttons: [{
                text: buttoncancel
              }]
            });
            return await alert.present();
          })
        } else {
        reject();
      }
      // }
    });

  }
}

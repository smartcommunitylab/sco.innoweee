import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  getCatalogApi: string;
  contributionApi: string;
  getGameApi: string;
  buyComponentApi: string;
  endPoint: string;


  constructor(
    private http: HttpClient,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
      this.getCatalogApi = config.getCatalogApi;
      this.contributionApi = config.contributionApi;
      this.getGameApi = config.getGameApi;
      this.buyComponentApi = config.buyComponentApi;
      this.endPoint = config.apiEndpoint;
  }
    sendContribution(gameId,playerId,nameGE): Promise<any> {
    let url: string = this.endPoint +this.getGameApi+ gameId+ this.contributionApi+playerId+"?nameGE="+nameGE;

    return this.http.get(url).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response)
    }); 
  }
  handleError(response: any): any {
    throw new Error("Method not implemented.");
  }
}

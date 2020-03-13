import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';

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
    private http: HttpClient) {
      this.getCatalogApi = environment.getCatalogApi;
      this.contributionApi = environment.contributionApi;
      this.getGameApi = environment.getGameApi;
      this.buyComponentApi = environment.buyComponentApi;
      this.endPoint = environment.apiEndpoint;
  }

  createContributions(contributions: any): any {
    var localdistributions = [];
    contributions.forEach(contribute => {
      var arrayContribute = contribute
      if (contribute.donatedPoints && contribute.donatedPoints.length > 0)
        arrayContribute.donatedPointsValue = true;
      else
        arrayContribute.donatedPointsValue = false;
      if (contribute.receivedPoints && contribute.receivedPoints.length > 0)
        arrayContribute.receivedPointsValue = true;
      else
        arrayContribute.receivedPointsValue = false;
      localdistributions.push(arrayContribute);
    });
    return localdistributions;
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

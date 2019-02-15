import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { APP_CONFIG_TOKEN, APP_CONFIG, ApplicationConfig } from '../app-config';
import { Observable } from 'rxjs';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  endPoint: string = "";
  getDomainApi: string = "";
  getInstituteApi: string = "";
  getSchoolApi: string = "";
  getGameApi: string = "";
  getPlayerApi: string = "";
  constructor(private httpClient: HttpClient,
    private http: Http,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
    this.endPoint = config.apiEndpoint;
    this.getDomainApi = config.getDomainApi;
    this.getInstituteApi = config.getInstituteApi;
    this.getSchoolApi = config.getSchoolApi;
    this.getGameApi = config.getGameApi;
    this.getPlayerApi = config.getPlayerApi;
  }

  getDomain(): Promise<any> {
    let url: string = this.endPoint + this.getDomainApi;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response.json()
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getInstitute(domain: string): Promise<any> {
    let url: string = this.endPoint + this.getInstituteApi + "/" + domain;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response.json()
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getSchool(domain: string, institute: string): Promise<any> {
    let url: string = this.endPoint + this.getSchoolApi + "/" + domain + "/" + institute

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response.json()
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getGame(domain: string, institute: string, school: string): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + "/" + domain + "/" + institute + "/" + school;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response.json()
      }
      ).catch(response => {
        return this.handleError(response)
      });

  }
  getPlayer(gameId): Promise<any> {
    let url: string = this.endPoint + this.getPlayerApi + "/" + gameId;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response.json()
      }
      ).catch(response => {
        return this.handleError(response)
      });


  }
  getPlayerData(playerId, players): Object {
    return players[0];


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

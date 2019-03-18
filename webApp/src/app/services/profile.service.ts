import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { APP_CONFIG_TOKEN, APP_CONFIG, ApplicationConfig } from '../app-config';
import { Observable } from 'rxjs';
import { Http, ResponseContentType } from '@angular/http';
import { Storage } from '@ionic/storage';

const PLAYER_DATA_KEY = "PLAYER_DATA"
const PLAYER_STATE_KEY = "PLAYER_STATE"
const ALL_PLAYERS_KEY = "ALL_PLAYERS"
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
  playerData: any;
  getRobotImageApi:string="";
  constructor(private httpClient: HttpClient,
    private storage:Storage,
    private http: HttpClient,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
    this.endPoint = config.apiEndpoint;
    this.getDomainApi = config.getDomainApi;
    this.getInstituteApi = config.getInstituteApi;
    this.getSchoolApi = config.getSchoolApi;
    this.getGameApi = config.getGameApi;
    this.getPlayerApi = config.getPlayerApi;
    this.getRobotImageApi = config.getRobotImageApi;
  }

  getDomain(): Promise<any> {
    let url: string = this.endPoint + this.getDomainApi;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response
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
        return response
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
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getGame(domain: string, institute: string, school: string): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + domain + "/" + institute + "/" + school;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response
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
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getRobotImage(userId): Promise<any>{
    let url: string = this.endPoint + this.getRobotImageApi + "/" + userId;
    var promise = new Promise((resolve, reject) => {
        console.log("Async Work Complete");
        resolve(url);
    });
    return promise;
    // return this.http
    //         .get(url, { responseType: ResponseContentType.Blob }).toPromise().then(res => {
    //           res.blob()});
  }
  getPlayerState(gameId,playerId, nameGE?:string):Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId+"/state/"+playerId;

    return this.http.get(url)
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  
  getPlayerDataFromList(playerId, players): Object {

    this.playerData = players.filter(x => x.objectId == playerId)[0];
    return this.playerData;
  }
  getLocalPlayerData(): Promise<any> {
    return this.storage.get(PLAYER_DATA_KEY);

  }
  setPlayerData(data) {
    this.storage.set(PLAYER_DATA_KEY,data);
    // this.playerData = data;
  }
  setPlayerState(state) {
    this.storage.set(PLAYER_STATE_KEY,state);
  }
  setNewRobot(robot):Promise<any> {
    return this.getLocalPlayerData().then(res => {
      res.robot = robot
      this.setPlayerData(res);
    })
  }
  setAllPlayers(players) {
    this.storage.set(ALL_PLAYERS_KEY,players);

  }
  getAllPlayers() : Promise<any>{
    return this.storage.get(ALL_PLAYERS_KEY);

  }
  getLocalPlayerState() {
    return this.storage.get(PLAYER_STATE_KEY);

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

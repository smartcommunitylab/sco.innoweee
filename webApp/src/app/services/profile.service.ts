import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from './../../environments/environment';
import { Observable } from 'rxjs';
import { Http, ResponseContentType } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';

const DOMAIN_KEY = "DOMAIN"
const PLAYER_DATA_KEY = "PLAYER_DATA"
const PLAYER_STATE_KEY = "PLAYER_STATE"
const ALL_PLAYERS_KEY = "ALL_PLAYERS"
const TEACHER_KEY = "school-teacher"
const PARENT_KEY = "school-parent"
const OPERATOR_KEY = "collector-operator"
const OWNER_KEY = "owner";
const SCHOOL_OWNER_KEY = "school-owner";

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
  schoolName: string="";
  playerName:string="";

  constructor(private httpClient: HttpClient,
    private storage:Storage,
    private alertController:AlertController,
    private router: Router,
    private utils:UtilsService,
    private http: HttpClient) {
    this.endPoint = environment.apiEndpoint;
    this.getDomainApi = environment.getDomainApi;
    this.getInstituteApi = environment.getInstituteApi;
    this.getSchoolApi = environment.getSchoolApi;
    this.getGameApi = environment.getGameApi;
    this.getPlayerApi = environment.getPlayerApi;
    this.getRobotImageApi = environment.getRobotImageApi;
  }

  getParentKey() {
    return PARENT_KEY  }
      getTecherKey() {
    return TEACHER_KEY  }
      getSchoolOwnerKey() {
    return SCHOOL_OWNER_KEY
      }
      getOwnerKey() {
        return OWNER_KEY;
      }
  setProfileRole(profile: string) {
    window.localStorage.setItem('profile', profile);
  }
  getProfileRole() {
    return window.localStorage.getItem('profile');
  }
  setDomainMemorized(res: any) {
    localStorage.setItem(DOMAIN_KEY,JSON.stringify(res))
  }
  getDomainMemorized() {
    return JSON.parse(localStorage.getItem(DOMAIN_KEY));
  } 
  memorizePlayer(playerId, playerData, playerName, schoolName) {
    localStorage.setItem("playerId", JSON.stringify(playerId));
    localStorage.setItem("playerData", JSON.stringify(playerData));
    localStorage.setItem("playerName", JSON.stringify(playerName));
    localStorage.setItem("schoolName", JSON.stringify(schoolName));
  }
  cleanPlayer() {
    localStorage.removeItem("DOMAIN");
    localStorage.removeItem("playerId");
    localStorage.removeItem("playerData");
    localStorage.removeItem("playerName");
    localStorage.removeItem("schoolName");
    localStorage.removeItem("profile");
  }
  getDomain(token: string): Promise<any> {
    let url: string = this.endPoint + this.getDomainApi;

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
      });
  }
  getInstitute(domain: string,token: string): Promise<any> {
    let url: string = this.endPoint + this.getInstituteApi + "/" + domain;

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
      });
  }
  getSchool(domain: string, institute: string,token: string): Promise<any> {
    let url: string = this.endPoint + this.getSchoolApi + "/" + domain + "/" + institute

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
      });
  }
  getGame(domain: string, institute: string, school: string,token: string): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + domain + "/" + institute + "/" + school;

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
      });

  }
  getPlayer(gameId,token: string): Promise<any> {
    let url: string = this.endPoint + this.getPlayerApi + "/" + gameId;

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
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
  getPlayerState(gameId,playerId,token: string, nameGE?:string):Promise<any> {
    let url: string = this.endPoint + this.getGameApi + gameId+"/state/"+playerId+(nameGE?("?nameGE="+nameGE):"");

    return this.http.get(url,{ headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }})
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.utils.handleError(response)
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
  setLocalPlayerState(data) {
    this.storage.set(PLAYER_STATE_KEY,data);

  }
  getLocalPlayerState() {
    return this.storage.get(PLAYER_STATE_KEY);

  }
   setPlayerName(playerName) {
    this.playerName = playerName;
   }
   getPlayerName() {
     return this.playerName;
   }
setSchoolName(schoolName) {
this.schoolName=schoolName;
}
getSchoolName() {
return this.schoolName;
}

}

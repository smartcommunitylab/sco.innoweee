import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { APP_CONFIG_TOKEN, APP_CONFIG, ApplicationConfig } from '../app-config';
import { Observable } from 'rxjs';
import { Http, ResponseContentType } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

const PLAYER_DATA_KEY = "PLAYER_DATA"
const PLAYER_STATE_KEY = "PLAYER_STATE"
const ALL_PLAYERS_KEY = "ALL_PLAYERS"
const DOMAIN_KEY = "DOMAIN"
const TEACHER_KEY = "school-teacher"
const PARENT_KEY = "school-parent"
const OPERATOR_KEY = "collector-operator"
const OWNER_KEY = "owner";
const SCHOOL_OWNER_KEY = "school-owner";
@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  getCollector(): any {
return "ECODOM"  }
  checkServer() : Promise<any> {
    let url: string = 'https://aac.platform.smartcommunitylab.it/aac/.well-known/openid-configuration';
    return this.http.get(url,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'

      }
    }).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
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
  getOperatorKey() {
    return OPERATOR_KEY;
      }
      setDomainMemorized(res: any) {
        localStorage.setItem(DOMAIN_KEY,JSON.stringify(res))
      }
      getDomainMemorized() {
        return JSON.parse(localStorage.getItem(DOMAIN_KEY));
      }      

  registerParent(user: any, gameCode: any, token): Promise<any> {
    let url: string = this.endPoint + this.getDomainApi + this.parentApi + "/" + gameCode;
    let body = user;
    return this.http.post(url, body, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    }).toPromise().then(response => {
      return response;
    }).catch(response => {
      return this.handleError(response);
    });
  }

  getMemorizedPlayerId() {
    return JSON.parse(localStorage.getItem("playerId"));
  }
  getMemorizedPlayerData() {
    return JSON.parse(localStorage.getItem("playerData"));

  }
  getMemorizedPlayerName() {
    return JSON.parse(localStorage.getItem("playerName"));

  }
  getMemorizedSchool() {
    return JSON.parse(localStorage.getItem("schoolName"));

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

  getTeacherValue() {
    return TEACHER_KEY;
  }
  getParentValue() {
    return PARENT_KEY;
  }

  endPoint: string = "";
  getDomainApi: string = "";
  getInstituteApi: string = "";
  getSchoolApi: string = "";
  getGameApi: string = "";
  getPlayerApi: string = "";
  parentApi: string = "";
  playerData: any;
  getRobotImageApi: string = "";
  playerName: any;
  schoolName: any;
  constructor(
    private storage: Storage,
    private http: HttpClient,
    private alertController: AlertController,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
    this.endPoint = config.apiEndpoint;
    this.getDomainApi = config.getDomainApi;
    this.getInstituteApi = config.getInstituteApi;
    this.getSchoolApi = config.getSchoolApi;
    this.getGameApi = config.getGameApi;
    this.getPlayerApi = config.getPlayerApi;
    this.getRobotImageApi = config.getRobotImageApi;
    this.parentApi = config.parentApi;
  }
  setProfileRole(profile: string) {
    window.localStorage.setItem('profile', profile);
  }
  getProfileRole() {
    return window.localStorage.getItem('profile');
  }

  getDomain(token): Promise<any> {
    let url: string = this.endPoint + this.getDomainApi;
    // return Promise.resolve({"tenants":["TEST","TRENTO"]});
    return this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    })
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });

  }
  getInstitute(domain: string, token): Promise<any> {

    let url: string = this.endPoint + this.getInstituteApi + "/" + domain;

    return this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    })
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getSchool(domain: string, institute: string, token): Promise<any> {
    let url: string = this.endPoint + this.getSchoolApi + "/" + domain + "/" + institute

    return this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    })
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  getGame(domain: string, institute: string, school: string, token): Promise<any> {
    let url: string = this.endPoint + this.getGameApi + domain + "/" + institute + "/" + school;

    return this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    })
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });

  }
  getPlayer(gameId, token): Promise<any> {
    let url: string = this.endPoint + this.getPlayerApi + "/" + gameId;

    return this.http.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token

      }
    })
      .toPromise()
      .then(response => {
        return response
      }
      ).catch(response => {
        return this.handleError(response)
      });
  }
  // getRobotImage(userId): Promise<any>{
  //   let url: string = this.endPoint + this.getRobotImageApi + "/" + userId;
  //   var promise = new Promise((resolve, reject) => {
  //       console.log("Async Work Complete");
  //       resolve(url);
  //   });
  //   return promise;
  //   // return this.http
  //   //         .get(url, { responseType: ResponseContentType.Blob }).toPromise().then(res => {
  //   //           res.blob()});
  // }
  // getPlayerState(gameId,playerId, nameGE?:string):Promise<any> {
  //   let url: string = this.endPoint + this.getGameApi + gameId+"/state/"+playerId;

  //   return this.http.get(url)
  //     .toPromise()
  //     .then(response => {
  //       return response
  //     }
  //     ).catch(response => {
  //       return this.handleError(response)
  //     });
  // }

  getPlayerDataFromList(playerId, players): Object {

    this.playerData = players.filter(x => x.objectId == playerId)[0];
    return this.playerData;
  }
  getPlayerData(): Object {
    if (this.playerData)
      return this.playerData
    return null;
  }
  getLocalPlayerData(): Promise<any> {
    return this.storage.get(PLAYER_DATA_KEY);

  }
  setPlayerData(data) {
    this.playerData = data;

    this.storage.set(PLAYER_DATA_KEY, data);
    // this.playerData = data;
  }
  // setPlayerState(state) {
  //   this.storage.set(PLAYER_STATE_KEY,state);
  // }
  // setNewRobot(robot):Promise<any> {
  //   return this.getLocalPlayerData().then(res => {
  //     res.robot = robot
  //     this.setPlayerData(res);
  //   })
  // }
  setAllPlayers(players) {
    this.storage.set(ALL_PLAYERS_KEY, players);

  }
  getAllPlayers(): Promise<any> {
    return this.storage.get(ALL_PLAYERS_KEY);

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
    this.schoolName = schoolName;
  }
  getSchoolName() {
    return this.schoolName;
  }
  private handleError(error: any): Promise<any> {

    return new Promise<string>(async (resolve, reject) => {
      reject(error);

      // console.error('An error occurred', error);

      // if ((error.status == 401) || (error.status == 403))  {
      //   // // display toast and redirect to logout.
      //   // var errorObj = JSON.parse(error._body)
      //   // var errorMsg = 'Per favore accedi di nuovo.';
      //   // if (errorObj.errorMsg) {
      //   //   errorMsg = errorObj.errorMsg;
      //   // }
      //   reject();
      // } else {

      //     //loading was wrong, reload app

      //     const alert = await this.alertController.create({
      //       header: 'Errore di comunicazione',
      //       subHeader: 'Problema nella comunicazione con il server',
      //       message: 'Riavvia l\'aplicazione e assicurati di avere connettivita`',
      //       backdropDismiss: false ,
      //       buttons: [{
      //         text: 'Riavvia',
      //         handler: () => {
      //           window.location.reload();
      //         }
      //     }]
      //     });
      //     return await alert.present();
      //   }      
    });

  }
}

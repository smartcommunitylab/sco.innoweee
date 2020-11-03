import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { getAllRouteGuards } from '@angular/router/src/utils/preactivation';
import { async } from 'q';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { ClassComponent } from './modals/class/class.component';
import { OverlayEventDetail } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from 'src/app/services/utils.service';
import { MainPage } from 'src/app/class/MainPage';
import { MaterialService } from 'src/app/services/material.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { GameService } from 'src/app/services/game.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';


const PLAYER_DATA_KEY = 'playerData';
const REFRESH_TIME = 200;

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.page.html',
  styleUrls: ['./game-selection.page.scss'],
})
export class GameSelectionPage extends MainPage implements OnInit {
  playerName: any;
  


  constructor(
    translate: TranslateService,
    storage: Storage,
    private router: Router,
    private materialService: MaterialService,
    private profileService: ProfileService,
    private garbageCollection: GarbageCollectionService,
    private gameService: GameService,
    private utils:UtilsService,
    private _cdr: ChangeDetectorRef,
    public modalController: ModalController,
    public navCtrl: NavController, 
    private auth: AuthService,
    authService: AuthService) {
    super(translate, authService, storage,navCtrl);
    }
 
  domain: string = "";
  domains: [];
  institute = {};
  instituteId: string = "";
  institutes: [];
  school:any = {};
  schoolId: string = "";
  schools: [];
  game = {};
  gameId: string = "";
  games: [];
  player = {};
  playerId: string = "";
  players: [];
  playerData: {};
  playerState: {};
  ngOnInit() {
    
  }
  ionViewWillEnter() {
    this.getDomain()

  }
  
  enter() {
    this.router.navigate(['/home']);
  }
  
  async getDomain() {
    //this.presentLoading();
    const token = await this.auth.getValidToken();
    this.profileService.getDomain(token.accessToken).then(res => {
      console.log(res);
      this.domains = res.tenants;
      if (res.tenants.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.domain = res.tenants[0]
          this._cdr.detectChanges();
        }, REFRESH_TIME);

      }
    },err => {
      this.utils.handleError(err);
    }
    )
  }

  async getInstitute(domainId: string) {
    this.domain = domainId;
    const token = await this.auth.getValidToken();
    this.profileService.getInstitute(this.domain,token.accessToken).then(res => {
      console.log(res);
      this.institutes = res;
      if (res.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.institute = res[0];
          this.instituteId = res[0].objectId;
          this._cdr.detectChanges();
        }, REFRESH_TIME);

      }
    });
  }
  async getSchool(institute) {
    this.instituteId = institute.objectId;
    const token = await this.auth.getValidToken();
    this.profileService.getSchool(this.domain, this.instituteId,token.accessToken).then(res => {
      console.log(res);
      this.schools = res;
      if (res.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.school = res[0];

          this.schoolId = res[0].objectId;
          this._cdr.detectChanges();
        }, REFRESH_TIME);
      }
    });
  }

  async getGame(school) {
    this.schoolId = school.objectId;
    const token = await this.auth.getValidToken();
    this.profileService.getGame(this.domain, this.instituteId, this.schoolId,token.accessToken).then(res => {
      console.log(res);
      this.games = res;
      if (res.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.game = res[0];
          this.gameId = res[0].objectId;
          this._cdr.detectChanges();
        }, REFRESH_TIME);
      }

    });
  }
  async getPlayer(game) {
    this.gameId = game.objectId;
    const token = await this.auth.getValidToken();
    this.profileService.getPlayer(this.gameId,token.accessToken).then(res => {
      console.log(res);
      this.players = this.orderPlayer(res);
      this.profileService.setAllPlayers(this.players); // it is promise
      if (res.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.player = res[0];
          this.playerId = res[0].objectId;
          this.playerName = res[0].name;
          this._cdr.detectChanges();
        }, REFRESH_TIME);
      }
    });
  }
  private orderPlayer(res: any) {
    return res.sort((obj1, obj2) => {
      if (obj1.name > obj2.name) {
          return 1;
      }
  
      if (obj1.name < obj2.name) {
          return -1;
      }
  
      return 0;
  });
  }

  setPlayer(player) {
    this.playerId = player.objectId;
    this.playerName= player.name;
  }
  async getPlayerData() {
    this.playerData = this.profileService.getPlayerDataFromList(this.playerId, this.players);
    const token = await this.auth.getValidToken();
    this.profileService.getPlayerState(this.gameId, this.playerId,token.accessToken).then(res => {
      this.playerState = res;
      this.profileService.setPlayerData(this.playerData);
      this.profileService.setPlayerState(this.playerState);
      this.profileService.setPlayerName(this.playerName);
      this.profileService.setSchoolName(this.school["name"])
      this.router.navigate(['home']);
    })
  }
  async chooseClass() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ClassComponent,
        componentProps: {
          classes:this.players
        }
      });

    modal.onDidDismiss().then((detail: OverlayEventDetail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
        this.setPlayer(detail.data);
      }
    });

    await modal.present();

  }
  
  async presentLoading() {
    const loadingController = document.querySelector('ion-loading-controller');
    await loadingController.componentOnReady();
  
    const loadingElement = await loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent',
      duration: 2000
    });
    return await loadingElement.present();
  }
  
  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }

  getFooter() {
    return (this.translate.instant('footer_game_title'))
  }
  
}

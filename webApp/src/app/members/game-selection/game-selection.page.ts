import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { getAllRouteGuards } from '@angular/router/src/utils/preactivation';
import { async } from 'q';
import { ModalController, LoadingController } from '@ionic/angular';
import { ClassComponent } from './modals/class/class.component';
import { OverlayEventDetail } from '@ionic/core';
import { TranslateService } from '@ngx-translate/core';


const PLAYER_DATA_KEY = 'playerData';
const REFRESH_TIME = 200;

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.page.html',
  styleUrls: ['./game-selection.page.scss'],
})
export class GameSelectionPage implements OnInit {
  playerName: any;
  // @Output() title = new EventEmitter<string>();
  // setTitle(title:string){
  //    this.title.emit(title);
  // }
  constructor(private profileService: ProfileService,
    private translate: TranslateService,
    private router: Router, private fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    public modalController: ModalController,
    private loadingCtrl: LoadingController) {
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
  
  getDomain() {
    this.presentLoading();

    this.profileService.getDomain().then(res => {
      console.log(res);
      this.domains = res.tenants;
      if (res.tenants.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.domain = res.tenants[0]
          this._cdr.detectChanges();
        }, REFRESH_TIME);

      }
    }
    )
  }

  getInstitute(domainId: string) {
    this.domain = domainId;
    this.profileService.getInstitute(this.domain).then(res => {
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
  getSchool(institute) {
    this.instituteId = institute.objectId;
    this.profileService.getSchool(this.domain, this.instituteId).then(res => {
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

  getGame(school) {
    this.schoolId = school.objectId;
    this.profileService.getGame(this.domain, this.instituteId, this.schoolId).then(res => {
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
  getPlayer(game) {
    this.gameId = game.objectId;
    this.profileService.getPlayer(this.gameId).then(res => {
      console.log(res);
      this.players = res;
      this.profileService.setAllPlayers(this.players); // it is promise
      if (res.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.player = res[0];
          this.playerId = res[0].objectId;
          this._cdr.detectChanges();
        }, REFRESH_TIME);
      }
    });
  }

  setPlayer(player) {
    this.playerId = player.objectId;
    this.playerName= player.name;
  }
  getPlayerData() {
    this.playerData = this.profileService.getPlayerDataFromList(this.playerId, this.players);
    this.profileService.getPlayerState(this.gameId, this.playerId).then(res => {
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

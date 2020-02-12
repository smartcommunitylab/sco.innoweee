import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { OverlayEventDetail } from '@ionic/core';
import { ModalController, AlertController, ToastController, NavController } from '@ionic/angular';
import { ClassComponent } from './modal/class/class.component'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonPage } from 'src/app/class/common-page';
import { DataServerService } from 'src/app/services/data.service';
import { ClassificationService } from 'src/app/services/classification.service';
import {Location} from '@angular/common';

const REFRESH_TIME = 500;
@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.page.html',
  styleUrls: ['./select-class.page.scss'],
})


export class SelectClassPage extends CommonPage implements OnInit {
  domain: string = "";
  domains: [];
  institute = {};
  instituteId: string = "";
  institutes: [];
  school = {};
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
  playerName: any;
  profile:string;
  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public auth:AuthService,
    public dataServerService: DataServerService,
    private _cdr: ChangeDetectorRef,
    private modalController: ModalController,
    public location:Location,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public classificationService: ClassificationService,
    private navCtrl: NavController

  ) {
    super( auth,router,translate, toastController,route,dataServerService,location,profileService,authService) }

  ngOnInit() {
    this.getDomain();
    this.profile = this.profileService.getProfileRole();
  }
  enter() {
    this.router.navigate(['/home']);
  }
   async getDomain() {
    console.log("getDomain");
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {
    this.profileService.getDomain(token.accessToken).then(res => {
      console.log(res);
      this.domains = res.tenants;
      if (res.tenants.length == 1) {
        let refreshTimeout = setTimeout(() => {
          this.domain = res.tenants[0]
          this._cdr.detectChanges();
        }, REFRESH_TIME);

      }
    }, err => {
      console.log(err);
    }   )
  // })
}

  async getInstitute(domainId: string) {
    console.log("getInstitute");

    this.domain = domainId;
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {
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
  // })
  }
  async getSchool(institute) {
    console.log("getSchool");

    this.instituteId = institute.objectId;
    const token = await this.auth.getValidToken();

    // this.authService.getValidAACtoken().then( token => {

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
  // })
  }

  async getGame(school) {
    this.schoolId = school.objectId;
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {

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
  // })
  }
  async getPlayer(game) {
    this.gameId = game.objectId;
    const token = await this.auth.getValidToken();

    // this.authService.getValidAACtoken().then( token => {
    this.profileService.getPlayer(this.gameId,token.accessToken).then(res => {
      // console.log(res);
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
  // })
  }
  orderPlayer(res: any) {
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
    this.playerName = player.name;
  }
  getPlayerData() {
    this.playerData = this.profileService.getPlayerDataFromList(this.playerId, this.players);
    // this.profileService.getPlayerState(this.gameId, this.playerId).then(res => {
      // this.playerState = res;
      this.profileService.setPlayerData(this.playerData);
      // this.profileService.setPlayerState(this.playerState);
      this.profileService.setPlayerName(this.playerName);
      this.profileService.setSchoolName(this.school["name"]);
      this.profileService.memorizePlayer(this.playerId,this.playerData, this.playerName, this.school["name"]);
      this.navCtrl.navigateRoot('/home', { queryParams: { playerId: this.playerId, playerName: this.playerName, playerData: JSON.stringify(this.playerData) } });

      // this.router.navigate(['home'], { queryParams: { playerId: this.playerId, playerName: this.playerName, playerData: JSON.stringify(this.playerData) } });
    // })
  }
  async chooseClass() {
    const modal: HTMLIonModalElement =
      await this.modalController.create({
        component: ClassComponent,
        componentProps: {
          classes: this.players
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


  getFooter() {
    return (this.translate.instant('footer_game_title'))
  }

}

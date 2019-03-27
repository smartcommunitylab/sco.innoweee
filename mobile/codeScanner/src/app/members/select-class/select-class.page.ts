import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { OverlayEventDetail } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { ClassComponent } from './modal/class/class.component'
const REFRESH_TIME = 200;
@Component({
  selector: 'app-select-class',
  templateUrl: './select-class.page.html',
  styleUrls: ['./select-class.page.scss'],
})


export class SelectClassPage implements OnInit {
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
  constructor(private profileService: ProfileService,
    private router: Router, private fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private translate: TranslateService,
    private modalController: ModalController,
    private translateService: TranslateService) {
      console.log('select-class')
  }

  ngOnInit() {
    this.getDomain()
  }
  enter() {
    this.router.navigate(['/home']);
  }
  getDomain() {

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
    this.playerName = player.name;
  }
  getPlayerData() {
    this.playerData = this.profileService.getPlayerDataFromList(this.playerId, this.players);
    // this.profileService.getPlayerState(this.gameId, this.playerId).then(res => {
      // this.playerState = res;
      // this.profileService.setPlayerData(this.playerData);
      // this.profileService.setPlayerState(this.playerState);
      this.profileService.setPlayerName(this.playerName);
      this.profileService.setSchoolName(this.school["name"]);
      this.router.navigate(['dashboard'], { queryParams: { playerId: this.playerId, playerName: this.playerName } });
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

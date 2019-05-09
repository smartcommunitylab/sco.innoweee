import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { MainPage } from '../../class/MainPage'
import { MaterialService } from 'src/app/services/material.service';
import { ProfileService } from 'src/app/services/profile.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { Route, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
const ROUTER_KEY = "router-key"

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage extends MainPage implements OnInit {
  image1: String = './assets/images/recycle.png';
  imgRobot: String = '';
  image3: String = './assets/images/edu.png';
  image4: String = './assets/images/team.png';

  playerData: any;
  materials: number;
  weeklyGarbage: any = {};
  weeklyDateFrom: number = new Date().getTime();
  weeklyDateTo: number = new Date().getTime();
  constructor(
    translate: TranslateService,
    storage: Storage,
    private router: Router,
    private materialService: MaterialService,
    private profileService: ProfileService,
    private garbageCollection: GarbageCollectionService,
    public navCtrl: NavController, 
    authService: AuthenticationService) {
    super(translate, authService, storage,navCtrl);
  }

  ngOnInit() {
    super.ngOnInit();
    this.setRoute("home");
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.ionViewDidEnter();
      this.materialService.getMaterial(this.playerData.gameId).then(res => {
        this.materials = res.length;
        this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
          this.weeklyGarbage = res.message
          this.weeklyDateFrom = res.from;
          this.weeklyDateTo = res.to;
        });
      });
    });
  }
  ionViewDidEnter() {
    super.ionViewDidEnter();
    if (this.playerData) {
      this.profileService.getRobotImage(this.playerData.objectId).then(res => {
        this.imgRobot = res + '?' + (new Date().getTime());
      })
    }
  }

  getWantedMessage() {
    if (this.weeklyGarbage)
      return this.weeklyGarbage[this.translate.currentLang];
    else return ""
  }
  getDateMessageFrom() {
    if (this.weeklyGarbage)
      return this.weeklyDateFrom ;
    else return ""
  }
  getDateMessageTo() {
    if (this.weeklyGarbage)
      return this.weeklyDateTo;
    else return ""
  }
  getFooter() {
    return (this.translate.instant('footer_game_title') + " | " + this.getSchoolName() + " | " + this.getClassName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
  goTo(link) {
    this.router.navigate([link]);
  }
}
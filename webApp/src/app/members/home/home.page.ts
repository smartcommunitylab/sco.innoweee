import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { MainPage } from '../../class/MainPage'
import { MaterialService } from 'src/app/services/material.service';
import { ProfileService } from 'src/app/services/profile.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
const ROUTER_KEY = "router-key"

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage extends MainPage implements OnInit {
  image1: String = '../assets/images/recycle.png';
  imgRobot: String = '../assets/images/robot.png';
  image3: String = '../assets/images/edu.png';
  image4: String = '../assets/images/team.png';

  playerData: any;
  materials: number;
  weeklyGarbage: any = {};
  constructor(
    translate: TranslateService,
    storage: Storage,
    private materialService: MaterialService,
    private profileService: ProfileService,
    private garbageCollection: GarbageCollectionService,
    authService: AuthenticationService) {
    super(translate, authService, storage);
  }

  ngOnInit() {
    this.setRoute("home");
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.materialService.getMaterial(this.playerData.gameId).then(res => {
        this.materials = res.length;
        this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
          this.weeklyGarbage = res.message
        });
      });

    });
  }
  ionViewDidEnter() {
    this.profileService.getRobotImage(this.playerData.objectId).then(res => {
      this.imgRobot = res + '?' + (new Date().getTime());
    })
  }

  getWantedMessage() {
    if (this.weeklyGarbage)
      return this.weeklyGarbage[this.translate.currentLang];
    else return ""
  }

}
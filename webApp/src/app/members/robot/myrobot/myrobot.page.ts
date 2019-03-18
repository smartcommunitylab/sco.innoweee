import { Component, OnInit } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';

const FOLDER_COMPONENTS = "../../../assets/images/components/";
@Component({
  selector: 'app-myrobot',
  templateUrl: './myrobot.page.html',
  styleUrls: ['./myrobot.page.scss'],
})
export class MyrobotPage extends MainPage implements OnInit {
  profileData;
  profileState;
  maxResource;
  mapUri: any;
  resources: any[] = [];
  max = {
    'Kg': 0,
    'g': 0,
    'mg': 0
  };
  constructor(public translate: TranslateService,
    public storage: Storage,
    public authService: AuthenticationService,
    private garbageService: GarbageCollectionService,
    public profileService: ProfileService) {
    super(translate, authService, storage);
  }

  ngOnInit() {
    super.setRoute("myrobot");
    this.mapUri = {};


  }

  ionViewWillEnter() {
    this.profileService.getLocalPlayerData().then(res => {
      this.profileData = res
      Object.keys(res.robot.components).forEach(key => {
        this.mapUri[res.robot.components[key].type] = res.robot.components[key].imageUri;
      })
      this.profileService.getPlayerState(this.profileData.gameId, this.profileData.objectId).then(res => {
        this.profileState = res;
        this.profileService.setPlayerState(res);
        this.orderResources(this.profileState)
      });
    });
  }
  orderResources(map) {
    var arrayResources = this.garbageService.getArrayResources();
    for (const [key, value] of Object.entries(map)) {
      if (arrayResources.indexOf(key) > -1) {
        this.resources.push({ "key": key, "value": map[key] });
        this.addMax(map[key]);
      }
    };
    this.resources.sort((a, b) => {
      return b.value - a.value
    })


  }
  addMax(value) {
    if (value > 1 && (this.max['Kg'] < value))
      return this.max['Kg'] = value;
    if (value < 1 && value > 0.001 && (this.max['g'] < value))
      return this.max['g'] = value;
    if (value < 0.001 && (this.max['mg'] < value))
      return this.max['mg'] = value;
  }
  getResourceLabel(label) {
    return 'resource_' + label;
  }
  getResourceValue(label) {
    if (this.profileState)
      return this.profileState[label];
    else return ""
  }
  getImg(piece) {
    if (this.mapUri[piece]) {
      return FOLDER_COMPONENTS + this.mapUri[piece];
    }
    return "";
  }

  getResourceBar(value) {
    //take maximum of group and retun proportional
    if (value > 1)
      return value / this.max['Kg'];
    if (value < 1 && value > 0.001)
      return value / this.max['g'];
    if (value < 0.001)
      return value / this.max['mg'];
  }

  ionViewDidEnter() {
    this.mapUri = {};
    this.profileService.getLocalPlayerData().then(res => {
      this.profileData = res
      Object.keys(res.robot.components).forEach(key => {
        this.mapUri[res.robot.components[key].type] = res.robot.components[key].imageUri;
      })

    });
  }

}

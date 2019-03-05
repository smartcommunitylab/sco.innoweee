import { Component, OnInit } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

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
  constructor(public translate: TranslateService,
    public storage: Storage,
    public authService: AuthenticationService,
    public profileService: ProfileService) {
    super(translate, authService, storage);
  }

  ngOnInit() {
    super.setRoute("myrobot");
    this.mapUri = {};
    this.profileService.getLocalPlayerData().then(res => {
      this.profileData = res
      Object.keys(res.robot.components).forEach(key => {
        this.mapUri[res.robot.components[key].type] = res.robot.components[key].imageUri;
      })

    });
    this.profileService.getLocalPlayerState().then(res => {
      this.profileState = res;
    });
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

  getResourceBar(resource) {
    return '0.7';
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

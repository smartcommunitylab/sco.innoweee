import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { Router } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';
import { Storage } from '@ionic/storage';
import { MainPage } from 'src/app/class/MainPage';

@Component({
  selector: 'app-recycle-results',
  templateUrl: './recycle-results.page.html',
  styleUrls: ['./recycle-results.page.scss'],
})
export class RecycleResultsPage extends MainPage implements OnInit {
  playerData: any;
  nameGE: any;
  profileState: any;
  resources: any[] = [];
  max = {
    'Kg': 0,
    'g': 0,
    'mg': 0
  };
  constructor(public translate: TranslateService,
    public storage: Storage,
    public toastController: ToastController,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private garbageCollection: GarbageCollectionService,
    private router: Router,
    private garbageService: GarbageCollectionService,
    public catalogService: CatalogService) {
      super(translate,authService,storage);
      }
  ngOnInit() {
    super.ngOnInit();
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
        this.nameGE = res.nameGE
        this.profileService.getPlayerState(this.playerData.gameId, this.playerData.objectId, this.nameGE).then(res => {
          this.profileState = res;
          this.orderResources(this.profileState)
        });
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

  getResourceBar(value) {
    //take maximum of group and retun proportional
    if (value > 1)
      return value / this.max['Kg'];
    if (value < 1 && value > 0.001)
      return value / this.max['g'];
    if (value < 0.001)
      return value / this.max['mg'];
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }

  getFooter() {
    return (this.translate.instant('footer_game_title')+" | "+this.getSchoolName()+" | "+this.getClassName())
  }

  getResourceUnit(value) {
    if (value > 1)
      return "Kg"
    if (value < 1 && value > 0.001)
      return "g"
    return "mg"
  }
  goHome() {
    this.navCtrl.navigateRoot('/home');

  }
}

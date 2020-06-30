import { Component, OnInit } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { ProfileService } from 'src/app/services/profile.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';
import { AuthService } from 'src/app/auth/auth.service';

const FOLDER_COMPONENTS = "./assets/images/components/";
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
  actualCollection: any;
  contributions: any[] = [];
  resources: any[] = [];
  max = {
    'Kg': 0,
    'g': 0,
    'mg': 0
  };
  numeroRaccoltaRicevuto: string;
  numeroRaccoltaDonato: string;
  classiDonato: string;
  classiRicevuto: string;
  constructor(public translate: TranslateService,
    public storage: Storage,
    private router: Router,
    public authService: AuthService,
    private garbageService: GarbageCollectionService,
    private gameService: GameService,
    private auth: AuthService,
    public navCtrl: NavController,

    public profileService: ProfileService) {
    super(translate, authService, storage, navCtrl);
  }

  ngOnInit() {
    super.ngOnInit();
    super.setRoute("myrobot");
    this.mapUri = {};


  }

  ionViewWillEnter() {
    super.ionViewDidEnter();
    this.resources = [];
    this.contributions = [];
    this.profileService.getLocalPlayerData().then(async res => {
      this.profileData = res
      if (this.profileData) {
        const token = await this.auth.getValidToken();
        this.garbageService.getActualCollection(this.profileData.gameId,token.accessToken).then(res => {
          this.actualCollection = res;
          this.contributions = this.gameService.createContributions(this.profileData.contributions);
          this.getNumeroRaccolta();
          this.getActualClassesDonate();

        })
      }
      Object.keys(res.robot.components).forEach(key => {
        this.mapUri[res.robot.components[key].type] = res.robot.components[key].imageUri;
      })
      const token = await this.auth.getValidToken();
      this.profileService.getPlayerState(this.profileData.gameId, this.profileData.objectId, token.accessToken).then(res => {
        this.profileState = res;
        this.profileService.setPlayerState(res);
        this.orderResources(this.profileState)
      });
    });
  }
  isFuture(contribute) {
    if (this.actualCollection && contribute && this.actualCollection.nameGE >= contribute.garbageCollectionName)
      return false;
    return true
  }
  getActualClassesDonate() {
      //
      var listaClassi = "";
      var element;
    if (this.contributions && this.actualCollection){
      for (let index = 0; index < this.contributions.length; index++) {
         element = this.contributions[index];
         if (element.garbageCollectionId == this.actualCollection.objectId){
          //build list of contribution
          if (element.donatedPoints)
          for (let k = 0; k < element.donatedPoints.length; k++) {
            listaClassi = listaClassi + " "+element.donatedPoints[k].playerName;
            
          }
          break;
         }
      }
      this.classiDonato= listaClassi;
    }
  }
  getNumeroRaccolta() {
    if (this.actualCollection && this.actualCollection.nameGE){
    var numeroraccolta=this.actualCollection.nameGE
    this.translate.get('garbage_donation_label', { numeroRaccolta: numeroraccolta }).subscribe((s: string) => {
      this.numeroRaccoltaDonato= s;
    });
    this.translate.get('garbage_received_label', { numeroRaccolta: numeroraccolta }).subscribe((s: string) => {
      this.numeroRaccoltaRicevuto= s;
    });
  }
  }
  
  actualDonate() {
    for (let index = 0; index < this.contributions.length; index++) {
      const element = this.contributions[index];
      if (this.actualCollection.nameGE == element.garbageCollectionName)
      return element.donatedPointsValue
    }
    return false
  }

  actualReceived() {
    // ?
    for (let index = 0; index < this.contributions.length; index++) {
      const element = this.contributions[index];
      if (this.actualCollection.nameGE == element.garbageCollectionName)
      return element.receivedPointsValue
    }
    return false
  }

  getActualClassesReceived() {
      //
      var listaClassi = "";
      var element;
    if (this.contributions && this.actualCollection){
      for (let index = 0; index < this.contributions.length; index++) {
         element = this.contributions[index];
         if (element.garbageCollectionId == this.actualCollection.objectId){
          //build list of contribution
          if (element.receivedPoints)
          for (let k = 0; k < element.receivedPoints.length; k++) {
            listaClassi = listaClassi + " "+element.receivedPoints[k].playerName;
            
          }
          break;
         }
      }
      this.classiRicevuto= listaClassi;
    }
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
  getResourceUnit(value) {
    if (value > 1)
      return "Kg"
    if (value < 1 && value > 0.001)
      return "g"
    return "mg"
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

  change() {
    this.router.navigate(["change"]);
  }
}

import { Component, OnInit, Inject, TrackByFunction } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { environment } from './../../../../environments/environment';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';

@Component({
  selector: 'app-allteam',
  templateUrl: './allteam.page.html',
  styleUrls: ['./allteam.page.scss'],
})
export class AllteamPage extends MainPage implements OnInit {
  listSections: any = [];
  imgUrl: string;
  profileState: any;
  profileClassState: any;
  school;
  gameId;
  playerData: any = {};
  mapImg: any = {};
  selectedClass: any;
  resources: any[] = [];
  max = {
    'Kg': 0,
    'g': 0,
    'mg': 0
  };

  constructor(public translate: TranslateService,
    public storage: Storage,
    public authService: AuthenticationService,
    public garbageService: GarbageCollectionService,
    public navCtrl: NavController, 
    public profileService: ProfileService) {
    super(translate, authService, storage,navCtrl);
    this.imgUrl = environment.apiEndpoint + environment.getRobotImageApi;
  }

  ngOnInit() {
    super.ngOnInit();
    super.setRoute("allteam");
    this.profileService.getAllPlayers().then(players => {
      this.gameId = players[0].gameId;
      this.listSections = players.filter(item => item.team == false)
      this.school = players.find(item => item.team == true)
      this.profileService.getPlayerState(this.gameId, this.school.objectId).then(res => {
        this.profileState = res;
        this.orderResources(this.profileState)
      });
      this.profileService.getLocalPlayerData().then(res => {
        this.playerData = res;
        this.listSections.forEach(section => {
          this.mapImg[section.objectId] = this.imgUrl + section.objectId + "/thumb" + ((section.objectId != this.playerData.objectId) ? "" : "?" + new Date().getTime());
        });
      })
    })
  }
  ionViewWillEnter() {
    super.ionViewDidEnter();
    this.selectedClass = null;
  }
  /*create a table of 4 columns*/
  public columns = 6;

  public get table(): number[][] {
    const rowCount = Math.floor(this.listSections.length / this.columns);
    const remainder = this.listSections.length % this.columns;
    const rows = [];
    for (let i = 0; i < rowCount; i++) {
      rows.push(this.listSections.slice(i * this.columns, (i * this.columns) + this.columns))
    }
    if (remainder) {
      rows.push(this.listSections.slice(this.listSections.length - remainder, this.listSections.length));
    }
    return rows;
  };

  public trackRow: TrackByFunction<number[]> = (index, item) => {
    return index;
  };

  public trackRecord: TrackByFunction<number> = (index, item) => {
    return item;
  };

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
  getResourceClassValue(label) {
    if (this.profileClassState)
      return this.profileClassState[label];
    else return ""
  }
  getResourceClassBar(label, value) {
    if (this.profileClassState) {
      // if (this.profileClassState[label] > 1)
      // return this.profileClassState[label] / value;
      if (value > 1)
        return this.profileClassState[label] / this.max['Kg'];
      if (value < 1 && value > 0.001)
        return this.profileClassState[label] / this.max['g'];
      if (value < 0.001)
        return this.profileClassState[label] / this.max['mg'];
    }
  }
  // getResourceLabel(label) {
  //   return 'resource_' + label;
  // }
  // getResourceValue(label) {
  //   if (this.profileState)
  //     return this.profileState[label];
  //   else return ""
  // }
  // getResourceBar(resource) {
  //   return '0.7';
  // }
  // getResourceClassValue(label) {
  //   if (this.profileClassState)
  //     return this.profileClassState[label];
  //   else return ""
  // }
  // getResourceClassBar(resource) {
  //   return '0.2';
  // }
  selectClass(selectedClass) {
    if (!this.selectedClass || this.selectedClass["objectId"]!=selectedClass.objectId) {
      this.selectedClass = selectedClass;
      this.profileService.getPlayerState(this.gameId, this.selectedClass.objectId).then(res => {
        this.profileClassState = res;
      });
    } else {
      this.selectedClass = null;
    }
  }
  isSelectedClass(cell) {
    if (this.selectedClass)
      return (this.selectedClass.objectId != cell.objectId)
    return false
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
}

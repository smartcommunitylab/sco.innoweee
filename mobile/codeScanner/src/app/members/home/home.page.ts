import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AuthService } from 'src/app/auth/auth.service';
import { IAuthAction, AuthActions } from 'ionic-appauth';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';
import { isEmpty } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends CommonPage implements OnInit {

  scanData: any = null;
  options: BarcodeScannerOptions;
  playerId: any;
  playerName: any;
  itemPresent: boolean;
  weeklyGarbage: any = {};
  weeklyDateFrom: number = new Date().getTime();
  weeklyDateTo: number = new Date().getTime();
  playerData: any;
  currentWeekLabel: any;
  action: IAuthAction;
  schoolName: any;
  myRole: string;
  garbageCollectionName: any;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private dataService: DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private barcodeScanner: BarcodeScanner,
    private navCtrl: NavController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }
  ionViewWillEnter() {
    this.scanData = null;
    this.itemPresent = false;
  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        if (Object.keys(params).length === 0) {
          this.playerId = this.profileService.getMemorizedPlayerId();
          this.playerData = this.profileService.getMemorizedPlayerData();
          this.playerName = this.profileService.getMemorizedPlayerName();
          this.schoolName = this.profileService.getMemorizedSchool();
          this.profileService.setPlayerData(this.playerData);
          // this.profileService.setPlayerState(this.playerState);
          this.profileService.setPlayerName(this.playerName);
          this.profileService.setSchoolName(this.schoolName);
        }
        else {
          this.playerId = params.playerId;
          this.playerName = params.playerName;
          this.playerData = JSON.parse(params.playerData);
        }

      });
    if (this.profileService.getPlayerData()) {
      this.setCollectionData();
    } else {
      this.profileService.getLocalPlayerData().then(res => {
        this.setCollectionData();
      })
    }
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('profile');
      }
    });
    this.myRole = this.profileService.getProfileRole();
  }

  isParent() {
    return this.myRole === this.profileService.getParentValue();
  }
  async setCollectionData() {
    try {
      const token = await this.auth.getValidToken();

      this.dataServerService.getActualCollection(this.profileService.getPlayerData()["gameId"], token.accessToken).then(res => {
        if (res) {
          this.garbageCollectionName = res.nameGE;
          this.weeklyGarbage = res.message
          this.weeklyDateFrom = res.from;
          this.weeklyDateTo = res.to;
          this.getWantedMessage();
        }
      })
    } catch (e) {
      console.log(e);
    }
  }
  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {
      console.log(barcodeData);
      if (barcodeData && barcodeData.cancelled!=true) {
        this.scanData = barcodeData.text;
        this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })
      }
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  manualInsert() {
    this.router.navigate(['manual-insert'], { queryParams: { playerId: this.playerId } });
  }
  stats() {
    this.router.navigate(['result']);
  }
  signOut() {
    this.auth.signOut();
  }

  getWantedMessage() {
    if (this.weeklyGarbage && this.translate.defaultLang && this.weeklyGarbage[this.translate.defaultLang])
      this.currentWeekLabel = this.weeklyGarbage[this.translate.defaultLang];
    else this.currentWeekLabel = ""
  }

  getDateMessageFrom() {
    if (this.weeklyGarbage)
      return this.weeklyDateFrom;
    else return ""
  }

  getDateMessageTo() {
    if (this.weeklyGarbage)
      return this.weeklyDateTo;
    else return ""
  }

  getFooter() {
    return (this.getClassName()) +' - '+(this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
  getImgName() {
    if (this.garbageCollectionName) {
      return './assets/images/collection/' + this.garbageCollectionName.toLowerCase() + ".png";
    }
    else
      return ""
  }
}

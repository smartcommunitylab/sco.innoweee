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

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private dataService:DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    private auth: AuthService,
    private barcodeScanner:BarcodeScanner,
    private navCtrl:NavController,
    public authService: AuthenticationService) {
    super(router, translate, toastController, route, dataServerService, location, profileService, authService)
   }
  ionViewWillEnter() {
    this.scanData = null;
    this.itemPresent = false;
  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        this.playerId = params.playerId;
        this.playerName = params.playerName;
        console.log("params.playerData"+params.playerData)
        this.playerData = JSON.parse(params.playerData);
        console.log(this.playerName); // popular
      });
      if (this.profileService.getPlayerData())
      {
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
}
  async setCollectionData() {
    const token = await this.auth.getValidToken();
    this.dataServerService.getActualCollection(this.profileService.getPlayerData()["gameId"],token.accessToken).then(res => {
     if (res){
      this.weeklyGarbage = res.message
      this.weeklyDateFrom = res.from;
      this.weeklyDateTo = res.to;
      this.getWantedMessage();
     }
    })
   }
  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      console.log(barcodeData);
      this.scanData = barcodeData.text;
      this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })
      // this.checkIfPresent(this.scanData);
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  manualInsert() {
    this.router.navigate(['manual-insert'], { queryParams: { playerId: this.playerId } });
  }
  signOut() {
    this.auth.signOut();
  }

  getWantedMessage() {
    if (this.weeklyGarbage && this.translate. defaultLang && this.weeklyGarbage[this.translate. defaultLang])
      this.currentWeekLabel=this.weeklyGarbage[this.translate. defaultLang];
    else this.currentWeekLabel=""
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
  // checkIfPresent(scanData) {
  //   this.dataServerService.checkIfPresent(scanData.text, this.playerId).then(res => {
  //     console.log(res);
  //     if (res.result) {
  //       //ok
  //       this.itemPresent = true;
  //     }
  //     else {
  //       //already used
  //       this.itemPresent = false;
  //     }


  //   })
  // }

  // sendLim() {
  //   if (!this.itemPresent) {
  //     this.dataServerService.sendItem(this.scanData.text, this.playerId).then(res => {
  //       console.log(res);
  //     })
  //   } else {
  //     this.presentToast("ola");
  //   }




  // }

  // async presentToast(string) {
  //   const toast = await this.toastController.create({
  //     message: string,
  //     duration: 2000
  //   })
  //   toast.present();
  // }

  getFooter() {
    return (this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

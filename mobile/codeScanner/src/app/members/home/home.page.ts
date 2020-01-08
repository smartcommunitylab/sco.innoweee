import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

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
  
  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private dataServerService: DataServerService,
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private toastController: ToastController,
    private router: Router) {
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
}
  setCollectionData() {
    this.authService.getValidAACtoken().then( token => {
    this.dataServerService.getActualCollection(this.profileService.getPlayerData()["gameId"],token).then(res => {
      this.weeklyGarbage = res.message
     this.weeklyDateFrom = res.from;
     this.weeklyDateTo = res.to;
     this.getWantedMessage();
    })
   })  }
  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      console.log(barcodeData);
      this.scanData = barcodeData;
      this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })
      // this.checkIfPresent(this.scanData);
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  manualInsert() {
    this.router.navigate(['manual-insert'], { queryParams: { playerId: this.playerId } });
  }
  // changeClass() {
  //   this.router.navigate(['select-class']);
  // }

  getWantedMessage() {
    if (this.weeklyGarbage && this.translate.currentLang && this.weeklyGarbage[this.translate.currentLang])
      this.currentWeekLabel=this.weeklyGarbage[this.translate.currentLang];
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

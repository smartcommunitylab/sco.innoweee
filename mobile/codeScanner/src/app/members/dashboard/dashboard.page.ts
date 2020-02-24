import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServerService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage extends CommonPage implements OnInit {
  scanData: any = null;
  options: BarcodeScannerOptions;
  playerId: any;
  playerName: any;
  itemPresent: boolean;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private dataService:DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private barcodeScanner: BarcodeScanner,
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
        this.playerId = params.playerId;
        this.playerName = params.playerName;
        console.log(this.playerName); // popular
      });
  }
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

  getFooter() {
    return (this.getClassName()) +' - '+(this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
  getClassName() {
    return this.profileService.getPlayerName();

  }
}

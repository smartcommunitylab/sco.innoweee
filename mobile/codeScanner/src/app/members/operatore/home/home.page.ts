import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage extends CommonPage implements OnInit  {
  scanData: any = null;
  options: BarcodeScannerOptions;

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
  ngOnInit() {
  }
  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      // console.log(barcodeData);
      // this.scanData = barcodeData.text;
      // this.router.navigate(['insert-old']);

      // this.checkIfPresent(this.scanData);
      this.insertCode(barcodeData.text);
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
  async insertCode(scanData) {
    console.log("scan Data"+scanData);
    //check if it is already inserted
    if (scanData) {
      const token = await this.auth.getValidToken();
      //itemId: any, tenantID: any, token: string
      this.dataServerService.findItem(scanData, this.profileService.getDomainMemorized()["tenants"][0], token.accessToken).then(res => {
        //already used
        if (!res) {
          //new item
          this.router.navigate(['insert-new'], { queryParams: { scanData: scanData}});

        }
        else {
          this.router.navigate(['insert-old'], { queryParams: { scanData: JSON.stringify(res)}} );
        }
      }
      ), err => {
        //presente con altro player id? Eccezione
      }
    } else {
      this.translate.get('empty_id').subscribe(res => {
        this.presentToast(res)
      })
   }
  }
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
  manualInsert() {
    this.router.navigate(['operatore-manual-insert'] );
  }
  stats() {
    this.router.navigate(['stats'] );
  }
  getFooter() {
    // return (this.getSchoolName())
  }

  // getSchoolName() {
  //   return this.profileService.getSchoolName();
  // }

}

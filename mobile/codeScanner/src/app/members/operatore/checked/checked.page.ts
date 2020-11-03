import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-checked',
  templateUrl: './checked.page.html',
  styleUrls: ['./checked.page.scss'],
})
export class CheckedPage extends CommonPage implements OnInit {

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
stats(){
  this.router.navigate(['stats']);

}
  goHome(){
    this.router.navigate(['home-operator']);

  }

}

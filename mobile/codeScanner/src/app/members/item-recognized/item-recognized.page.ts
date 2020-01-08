import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import {Location} from '@angular/common';

@Component({
  selector: 'app-item-recognized',
  templateUrl: './item-recognized.page.html',
  styleUrls: ['./item-recognized.page.scss'],
})
export class ItemRecognizedPage extends CommonPage implements OnInit {
  item: any;
  itemPresent: boolean;
  scanData: any;
  playerId: any;
  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public dataServerService: DataServerService,
    public location:Location,
    public profileService: ProfileService,
    public authService: AuthenticationService

  ) {
    super( router,translate, toastController,route,dataServerService,location,profileService,authService) }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        if (params) {
          this.item = JSON.parse(params.scanData);
          this.playerId = params.playerId;
          this.checkIfPresent(this.item);
        }
        // console.log(JSON.parse(this.item)); // popular
      });

  }

  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }

  // changeClass() {
  //   this.router.navigate(['select-class']);
  // }

  checkIfPresent(scanData) {
    this.authService.getValidAACtoken().then( token => {

    this.dataServerService.checkIfPresent(scanData.text, this.playerId, token).then(res => {
      // console.log(res);
      if (res.result) {
        //ok
        this.itemPresent = true;
      }
      else {
        //already used
        this.itemPresent = false;
      }
    })
  })
  }
  classify() {
    if (!this.itemPresent) {
      this.authService.getValidAACtoken().then( token => {
        this.router.navigate(['classification-type']);
      })
    } else {
      this.presentToast((this.translate.instant('toast_error')));
    }
  }
  sendLim() {
    if (!this.itemPresent) {
      this.authService.getValidAACtoken().then( token => {
      this.dataServerService.sendItem(this.item.text, this.playerId, token).then(res => {
        // console.log(res);
        this.presentToast((this.translate.instant('toast_ok')));
        this.location.back();
      })
    })
    } else {
      this.presentToast((this.translate.instant('toast_error')));
    }
  }
  cancel() {
    this.location.back();
    this.presentToast((this.translate.instant('toast_back')));

  }
  getFooter() {
    return ( this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

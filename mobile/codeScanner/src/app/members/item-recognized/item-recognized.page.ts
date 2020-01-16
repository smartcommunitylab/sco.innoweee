import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import {Location} from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';

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
  myRole: string;
  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    private auth:AuthService,
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
      this.myRole = this.profileService.getProfileRole();
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

  async checkIfPresent(scanData) {
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {

    this.dataServerService.checkIfPresent(scanData, this.playerId, token.accessToken).then(res => {
      // console.log(res);
      if (res && res.result) {
        //ok
        this.itemPresent = true;
      }
      else {
        //already used
        this.itemPresent = false;
      }
    })
  // })
  }
  async classify() {
    if (!this.itemPresent) {
      // const token = await this.auth.getValidToken();

      // this.authService.getValidAACtoken().then( token => {
        this.router.navigate(['classification-type']);
      // })
    } else {
      this.presentToast((this.translate.instant('toast_error')));
    }
  }
  async sendLim() {
    if (!this.itemPresent) {
      const token = await this.auth.getValidToken();
      // this.authService.getValidAACtoken().then( token => {
      this.dataServerService.sendItem(this.item.text, this.playerId, token.accessToken).then(res => {
        // console.log(res);
        this.presentToast((this.translate.instant('toast_ok')));
        this.location.back();
      })
    // })
    } else {
      this.presentToast((this.translate.instant('toast_error')));
    }
  }
  isParent() {
    return this.myRole=== this.profileService.getParentValue();
  }
  isTeacher() {
    return this.myRole=== this.profileService.getTeacherValue();

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

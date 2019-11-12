import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-item-recognized',
  templateUrl: './item-recognized.page.html',
  styleUrls: ['./item-recognized.page.scss'],
})
export class ItemRecognizedPage implements OnInit {
  item: any;
  itemPresent: boolean;
  scanData: any;
  playerId: any;
  constructor(private router: Router,
    private translate: TranslateService,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private dataServerService: DataServerService,
    private location:Location,
    private profileService: ProfileService,
    private authService: AuthenticationService

  ) { }

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
  // scanData(scanData: any): any {
  //   throw new Error("Method not implemented.");
  // }


  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
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

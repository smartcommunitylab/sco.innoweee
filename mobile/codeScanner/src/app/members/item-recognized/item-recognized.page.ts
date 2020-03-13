import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { ClassificationService } from 'src/app/services/classification.service';

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
  itemClassified: any;
  itemInfo: any = "";
  alreadyClassified: string;
  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public auth: AuthService,
    public dataServerService: DataServerService,
    public location: Location,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public classificationService: ClassificationService

  ) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

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



  async checkIfPresent(scanData) {
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {

    this.dataServerService.checkIfPresent(scanData, this.playerId, token.accessToken).then(res => {
      // console.log(res);
      if (res) {
        //ok
        this.itemPresent = true;
        this.itemClassified = res.state;
        this.itemInfo = this.calculateState(res);
        if (this.itemClassified == 1) {
          this.getAlreadyClassified();
        } else
          if (this.itemClassified == 2) {
            this.getAlreadyConfirmed();
          } else {
            //Todo generic case
          }
      }
      else {
        //already used
        this.itemPresent = false;
      }
    }, err => {
      //presente con altro player id? Eccezione
    })
    // })
  }
  getAlreadyClassified() {
    var label = ''
    if (this.isParent()) {
      if (this.itemInfo) {
        {
          label = 'label_item_already_classified_parent'
        }
        this.translate.get(label).subscribe((s: string) => {
          this.alreadyClassified = s;
        });
      }
    }
  }

  getAlreadyConfirmed() {
    var label = ''
    if (this.itemInfo) {
      if (this.isTeacher()) {
        label = 'label_item_present'
      }
      else {
        label = 'label_item_present_parent'
      }
      this.translate.get(label, { itemInfo: this.itemInfo }).subscribe((s: string) => {
        this.alreadyClassified = s;
      });
    }
  }
  private calculateState(item: any) {
    if (item && item.valuable) {
      return this.translate.instant("label_bin_value");

    }
    if (item && item.reusable) {
      return this.translate.instant("label_bin_reuse");
    }
    return this.translate.instant("label_bin_recycle");
  }
  async classify() {
    if (!this.itemPresent) {
      // const token = await this.auth.getValidToken();

      // this.authService.getValidAACtoken().then( token => {
      this.classificationService.initializeItem();
      this.classificationService.itemClassification.setItemId(this.item);

      this.router.navigate(['classification-type']);
      // })
    } else {
      this.presentToast((this.translate.instant('toast_error')));
    }
  }
  async sendLim() {
    // if (!this.itemPresent) {
    const token = await this.auth.getValidToken();
    // this.authService.getValidAACtoken().then( token => {
    this.dataServerService.sendItem(this.item, this.playerId, token.accessToken).then(res => {
      // console.log(res);
      this.presentToast((this.translate.instant('toast_ok')));
      this.location.back();
    })
    // })
    // } else {
    //   this.presentToast((this.translate.instant('toast_error')));
    // }
  }
  isParent() {
    return this.myRole === this.profileService.getParentValue();
  }
  isTeacher() {
    return this.myRole === this.profileService.getTeacherValue();

  }
  cancel() {
    this.location.back();
    this.presentToast((this.translate.instant('toast_back')));

  }
  getFooter() {
    return (this.getClassName()) + ' - ' + (this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

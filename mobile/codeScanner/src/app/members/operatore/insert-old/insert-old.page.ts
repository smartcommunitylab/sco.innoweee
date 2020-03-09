import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-insert-old',
  templateUrl: './insert-old.page.html',
  styleUrls: ['./insert-old.page.scss'],
})
export class InsertOldPage extends CommonPage implements OnInit {
  actualObj: any;
  workingConfirm:boolean;
  types: any =[];
  confirmedObj:any;
  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    public dataServerService: DataServerService,
    public location: Location,
    private navCtrl: NavController,
    public auth: AuthService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.scanData)
          {
            this.actualObj = JSON.parse(params.scanData);
          // this.workingConfirm= this.actualObj.broken
        }
        console.log(JSON.stringify(params))
        console.log(JSON.stringify(params.scanData))
      })
  }
cancel() {
  this.navCtrl.navigateRoot('home-operator');
}
getType() {
  console.log("TODO")
  return ""
}
confirmItem() {
    this.translate.get('label_classify').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('label_conferma_operatore');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Annulla',
            cssClass: 'secondary',
            handler: () => {
              this.router.navigate(['home']);
            }
          }, {
            text: 'Conferma',
            handler: async () => {
              const token = await this.auth.getValidToken();
              this.dataServerService.confirmItemOperator(this.profileService.getDomainMemorized()["tenants"][0],token,this.actualObj.itemId,this.workingConfirm,this.profileService.getCollector()).then(()=>{

              },err=>{

              })
  //call @PutMapping(value = "/api/collector/item/{tenantId}/check")
            }
          }
        ]
      });

      await alert.present();
    })
  // popup confirm
}
  getValueString(): string {
    if (this.actualObj && this.actualObj.valuable) {
      return this.translate.instant("label_recycle_string_value");
    }
    if (this.actualObj && this.actualObj.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");
  }
  getValueField(field): string {
    if (field) {
      return this.translate.instant("label_true");
    } else {
      return this.translate.instant("label_false");
    }
  }
  segmentChanged(event) {
    console.log(event);
  }
  getAge() {
    if (this.actualObj.age == 0)
      return this.translate.instant("answer_not_old");
    return this.translate.instant("answer_old");
  }
  getFooter() {
    //return (this.getSchoolName())
  }

}

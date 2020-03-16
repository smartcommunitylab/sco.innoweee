import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-operatore-manual-insert',
  templateUrl: './operatore-manual-insert.page.html',
  styleUrls: ['./operatore-manual-insert.page.scss'],
})
export class OperatoreManualInsertPage extends CommonPage implements OnInit {
  scanData: any = null;
  playerId: any;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.playerId = params.playerId;
      })
  }
  async insertCode() {
    //check if it is already inserted
    if (this.scanData) {
      if (this.scanData.length == 5) {
        const token = await this.auth.getValidToken();
        //itemId: any, tenantID: any, token: string
        this.dataServerService.findItem(this.scanData, this.profileService.getDomainMemorized()["tenants"][0], token.accessToken).then(res => {
          //already used
          if (!res) {
            //new item
            this.router.navigate(['insert-new'], { queryParams: { scanData: this.scanData } });

          }
          else {
            this.router.navigate(['insert-old'], { queryParams: { scanData: JSON.stringify(res) } });


          }
        }
        ), err => {
          //presente con altro player id? Eccezione
        }

      }
      else {
        this.translate.get('wrong_length_id').subscribe(res => {
          this.presentToast(res)
        })
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
  showDoubleId() {
    this.translate.get('classification_double_id_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('classification_double_id_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      });

      await alert.present();
    })
  }
  getFooter() {
    // return (this.getSchoolName())
  }

  // getSchoolName() {
  //   return this.profileService.getSchoolName();
  // }
}

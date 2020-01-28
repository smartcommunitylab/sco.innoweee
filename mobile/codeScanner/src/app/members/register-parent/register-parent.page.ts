import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';
import { IUserInfo } from 'src/app/class/user-info';

@Component({
  selector: 'app-register-parent',
  templateUrl: './register-parent.page.html',
  styleUrls: ['./register-parent.page.scss'],
})
export class RegisterParentPage extends CommonPage implements OnInit {
  user: any;
  gameCode: "";
  userInfo: IUserInfo;
  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController:AlertController,
    private dataService: DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    private auth: AuthService,
    private barcodeScanner: BarcodeScanner,
    private navCtrl: NavController,
    public authService: AuthenticationService) {
    super(router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  ngOnInit() {
    this.user = {
      "name": "",
      "surname": "",
      "email": ""
    }
    this.load();
  }

  async load() {
    await this.getUserInfo();
    console.log(JSON.stringify(this.userInfo));
    if (this.userInfo) {
      this.user["email"] = this.userInfo.email;
      this.user["name"] = this.userInfo.given_name;
      this.user["surname"] = this.userInfo.family_name;
    }
  }
  async enter() {

    const token = await this.auth.getValidToken();
    this.profileService.registerParent(this.user, this.gameCode, token.accessToken).then(res => {
      this.router.navigate(['select-class']);
    }, err => {
      this.manageError(err);
    })
  }
  async manageError(err: any) {
    if (err.error && err.error.errorType=="class it.smartcommunitylab.innoweee.engine.exception.EntityNotFoundException")
    {
      const alert = await this.alertController.create({
              header: 'PIN errato',
              message: 'Il PIN risulta errato. Verificare i dati e riprovare',
              backdropDismiss: false ,
              buttons: [{
                text: 'OK',

            }]
            });
            return await alert.present();
    }
  }
  public async getUserInfo(): Promise<void> {
    try {
      this.userInfo = await this.auth.getUserInfo<IUserInfo>();
    } catch (e) {
      console.log("error")
    }
  }

  getFooter() {
    return (this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
}

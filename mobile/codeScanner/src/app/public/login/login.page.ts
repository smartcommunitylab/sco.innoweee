import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IAuthAction, AuthActions } from 'ionic-appauth';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit  {
  loading: HTMLIonLoadingElement;
  action: IAuthAction;

  user = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthenticationService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private toastController: ToastController,
    private auth: AuthService,
    private profileService: ProfileService,
  private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {      
      this.auth.authObservable.subscribe(async (action) => {
        console.log("login back");
        if (action.action === AuthActions.SignInSuccess) {
          //check if profile is valid
          const token = await this.auth.getValidToken();
          console.log("token: "+token.accessToken)
          this.profileService.getDomain(token.accessToken).then(res => {
            this.router.navigate(['select-class']);
          }, err => {
            //check error
            this.router.navigate(['register-parent']);
          })
        }
      });

}
login() {
  this.auth.signIn();
}
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }

  presentLoading(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.translate.get('user_check').subscribe(async (res: string) => {
        this.loading = await this.loadingController.create({
          message: res
          // ,
          // duration: 2000
        });
        if (this.loading)
          await this.loading.present();
        resolve(null);

      });
    })

  }
  async dismissLoading() {
    if (this.loading)
      await this.loading.dismiss();

  }


}
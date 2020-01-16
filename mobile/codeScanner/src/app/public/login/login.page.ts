import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IAuthAction, AuthActions } from 'ionic-appauth';

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
  private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    // this.presentLoading().then(() => {
      this.auth.authObservable.subscribe((action) => {
        if (action.action === AuthActions.SignInSuccess) {
          this.router.navigate(['select-class']);
        }
      });
  //     this.authService.init().then(() => {
  //     this.authService.getValidAACtoken().then((validToken) =>{
  //     this.router.navigate(['select-class']);
  //     // this.dismissLoading()
  //   },err => {
  //     // this.translate.get('wrong_credentials').subscribe(async (res: string) => {
  //     //   this.presentToast(res);
  //     // });
  //   })
  // })
// })
}
login() {
  this.auth.signIn();
}

  // login() {
  //   this.presentLoading().then(() => {
  //     this.authService.init().then(() => {
  //       this.authService.login(this.authService.PROVIDER.INTERNAL, this.user).then(
  //         (profile) => {
  //           this.router.navigate(['select-class']);
  //           this.dismissLoading()
  //         },
  //          (res) => {
  //            if (res && res.error && res == "Invalid credentials"){
  //             this.translate.get('wrong_credentials').subscribe(async (res: string) => {
  //               this.presentToast(res);
  //             });
  //            }
  //            else if (res && res.error && res.error.error=='invalid_grant')
  //             {
  //               //invalid credential
  //               this.translate.get('wrong_user').subscribe(async (res: string) => {
  //                 this.presentToast(res);
  //               });

                
  //             }
  //             else if (res && res.error)
  //             {
  //               //invalid credential
  //               this.translate.get('toast_error').subscribe(async (res: string) => {
  //                 this.presentToast(res);
  //               });

                
  //             }
  //           this.dismissLoading()

  //         })
  //     })
  //   })

  //   // )}).finally(() => {  });
  // }
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

  // login() {
  //   this.authService.login();
  // }

}
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { JsonPipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loading: HTMLIonLoadingElement;
  user = {
    email: '',
    password: ''
  };
  constructor(private authService: AuthenticationService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private googlePlus: GooglePlus,
    private router: Router) { }

  ngOnInit() {
  }


  login() {
    this.presentLoading().then(() => {
      this.authService.init().then(() => {
        this.authService.login(this.authService.PROVIDER.INTERNAL, this.user).then(
          (profile) => {
            this.router.navigate(['select-class']);
            this.dismissLoading()
          },
           (error) => {
             if (error=='Invalid credentials')
              {
                //invalid credential
              }
            this.dismissLoading()

          })
      })
    })

    // )}).finally(() => {  });
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
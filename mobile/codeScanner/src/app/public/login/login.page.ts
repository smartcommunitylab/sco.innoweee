import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthenticationService,
    private loadingController: LoadingController,
    private googlePlus: GooglePlus,
    private router: Router) { }

  ngOnInit() {
  }

  async doGoogleLogin() {
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    this.presentLoading(loading);

    this.googlePlus.login({
      'scopes': 'profile email',
      'offline': true
    })
      .then(user => {
        
        loading.dismiss();
        console.log(JSON.stringify(user));
        
        this.authService.authorizeProvider(user.accessToken).then(res=>{
          console.log(res);
          this.authService.getAACtoken(res).then(
            function (tokenInfo) {
              // saveToken(tokenInfo);
              // user.provider = provider;
              console.log('[LOGIN] Logged in with ' + user.provider);
              this.authService.remoteAAC.getCompleteProfile(user.tokenInfo).then(
                function (profile) {
                  user.profile = profile;
                  // service.localStorage.saveUser();
                  // deferred.resolve(profile);
                },
                function (reason) {
                  // deferred.reject(reason);
                }
              );
            },
            function (error) {
              // deferred.reject(error);
            }
          );
          // window.localStorage.setItem('google_user', JSON.stringify({
          //   name: user.displayName,
          //   email: user.email,
          //   picture: user.imageUrl,
          //   accessToken: user.accessToken,
          //   expires: user.expires
          // }))
          this.router.navigate(['select-class']);
          loading.dismiss();
        });

      }, err => {
        console.log(err)
        loading.dismiss();
      });


  }
  async presentLoading(loading) {
    return await loading.present();
  }
  // login() {
  //   this.authService.login();
  // }

}
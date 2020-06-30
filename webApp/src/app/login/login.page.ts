import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { LoadingController, Platform, ToastController, NavController } from '@ionic/angular';
import { IAuthAction } from 'ionic-appauth';
import { Subscription } from 'rxjs';
import { ProfileService } from '../services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // constructor(private auth: AuthService,
  //   private loadingController: LoadingController
  //   ) { }

  // ngOnInit() {
  // }
  // ionViewDidEnter() {
  // }
  // login() {
  //   this.loginAuth();
  // }

  // async loginAuth() {
  //   const loading = await this.loadingController.create({
  //     duration: 2000
  //   });
  //   await loading.present();
  //   this.auth.signIn();
  // }
  loading: HTMLIonLoadingElement;
  action: IAuthAction;
  token:any;
    private subscription: Subscription;

  navigateFirst = {
    "school-teacher":"select-class",
    "school-parent":"select-class",
    "collector-operator":"home-operator",
  }
  user = {
    email: '',
    password: ''
  };
  public onlineOffline: boolean = navigator.onLine;

  constructor(
    private loadingController: LoadingController,
    private auth: AuthService,
    private platform:Platform,
    private toastController: ToastController,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
      

}

ionViewDidEnter() {
  this.login();
}
ngOnDestroy() {
  if (this.subscription)
  this.subscription.unsubscribe();
}
  async login() {
  const loading = await this.loadingController.create({
    duration: 2000
  });
  await loading.present();
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
    return new Promise(async (resolve, reject) => {
        this.loading = await this.loadingController.create({
          // ,
          // duration: 2000
        });
        if (this.loading)
          await this.loading.present();
        resolve(null);

    })

  }
  async dismissLoading() {
    if (this.loading)
      await this.loading.dismiss();

  }


}

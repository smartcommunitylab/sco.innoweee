import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/auth/auth.service';
import { IAuthAction, AuthActions } from 'ionic-appauth';
import { ProfileService } from 'src/app/services/profile.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit  {
  loading: HTMLIonLoadingElement;
  action: IAuthAction;
  token:any;
    private subscription: Subscription;

//   const TEACHER_KEY = "school-teacher"
// const PARENT_KEY = "school-parent"
// const OPERATOR_KEY = "collector-operator"
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

  constructor(private authService: AuthenticationService,
    private loadingController: LoadingController,
    private translate: TranslateService,
    private toastController: ToastController,
    private auth: AuthService,
    private platform:Platform,
    private profileService: ProfileService,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
      
    // this.subscription = this.auth.authObservable.subscribe(async (action) => {
    //     console.log("login back");
    //     console.dir(action);

    //     if (action.action === AuthActions.SignInSuccess) {
    //       const loading = await this.loadingController.create({
    //         duration: 2000
    //       });
    //       await loading.present();
    //       //check if profile is valid
    //       // const token = await this.auth.getValidToken();
    //       this.token = action.tokenResponse;
    //       // console.log("token: "+token.accessToken)
    //       this.profileService.getDomain(this.token.accessToken).then(res => {
    //         //check if domain is correct
    //         this.profileService.setDomainMemorized(res);
    //         if (this.checkProfileDomain(res))
    //           {
    //           this.navigateToFirstPage();
    //             }else{
    //           //error
    //           this.router.navigate(['profile']);
    //             this.presentToast("Profilo errato");

    //         }
    //       }, err => {
    //         //check error
    //         this.router.navigate(['register-parent']);
    //       })
    //     } else {
    //       if (!navigator.onLine) {
    //         this.presentToast("Connessione assente");

    //         }
    //     }
    //   });

}
  // navigateToFirstPage() {
  //   var selected=this.profileService.getProfileRole();
  //   console.log("struct:"+JSON.stringify(this.navigateFirst));
  //   console.log("selected:"+selected);
  //   this.navCtrl.navigateRoot(this.navigateFirst[selected]);
  //   // this.router.navigate([this.navigateFirst[selected]]);
  // }
  // checkProfileDomain(res: any):boolean {
  //   var returnVar=false;
  //   var selected=this.profileService.getProfileRole();
  //   for(var key in res.roles) {
  //     console.log("key: "+JSON.stringify(key));
  //     res.roles[key].forEach(element => {
  //       console.log("role: "+JSON.stringify(element.role));
  //       console.log("selected: "+selected);

  //       if (element.role === selected)
  //       returnVar= true
  //         if (element.role === this.profileService.getOwnerKey())
  //         returnVar= true
  //         if (element.role === this.profileService.getSchoolOwnerKey() && (selected==this.profileService.getTecherKey() ||selected==this.profileService.getParentKey())  )
  //         returnVar= true
  //       });
  //   }
  //   return returnVar
  // }
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
      duration: 2000,
      position: 'middle'
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
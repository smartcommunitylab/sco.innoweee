import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform, NavController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';
import { ProfileService } from './services/profile.service';
const ROUTER_KEY= "router-key"

@Component({
  styleUrls: ['./app.component.scss'],
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  title = "";
  subscription: any;
  token: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private toastController: ToastController,
    private navCtrl: NavController,
    private statusBar: StatusBar,
    private auth: AuthService,
    private router: Router,
    private storage:Storage,
    private  alertController:AlertController,
    private profileService:ProfileService,
    private loadingController: LoadingController,
    private authService: AuthService,
    private translate: TranslateService) {

    this.initializeApp();
  }

  ngOnInit() {

    // this.subscription = this.auth.authObservable.subscribe(async (action) => {
    //   console.log("login back");
    //   console.dir(action);

    //   if (action.action === AuthActions.SignInSuccess) {
    //     const loading = await this.loadingController.create({
    //       duration: 2000
    //     });
    //     await loading.present();
    //     //check if profile is valid
    //     this.token = action.tokenResponse;
    //     this.profileService.getDomain().then(res => {
    //       //check if domain is correct
    //       this.profileService.setDomainMemorized(res);
    //       if (this.checkProfileDomain(res)) {
    //         this.navigateToFirstPage();
    //       } else {
    //         //error
    //         this.router.navigate(['login']);
    //         //show alert with confirm of logout
    //         this.showAlertDone();
    //         //this.presentToast("Profilo errato");
    //       }
    //     }, err => {
    //       //check error
    //       this.router.navigate(['register-parent']);
    //     })
    //   } else if (action.action === AuthActions.SignOutSuccess) {
    //     this.router.navigate(['game-selection']);
    //   } else {
    //     if (!navigator.onLine) {
    //       this.presentToast("Connessione assente");

    //     }
    //   }
    // });
  }

  checkProfileDomain(res: any): boolean {
    var returnVar = false;
    var selected = this.profileService.getProfileRole();
    for (var key in res.roles) {
      console.log("key: " + JSON.stringify(key));
      res.roles[key].forEach(element => {
        console.log("role: " + JSON.stringify(element.role));
        console.log("selected: " + selected);

        if (element.role === selected)
          returnVar = true
        if (element.role === this.profileService.getOwnerKey())
          returnVar = true
        if (element.role === this.profileService.getSchoolOwnerKey() && (selected == this.profileService.getTecherKey() || selected == this.profileService.getParentKey()))
          returnVar = true
      });
    }
    return returnVar
  }
  navigateToFirstPage() {
    this.navCtrl.navigateRoot('home');
  }
  showAlertDone() {
    this.translate.get('wrong_profile_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('wrong_profile_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Logout',
            cssClass: 'secondary',
            handler: () => {
              try {
                console.log("signing out");

                this.auth.signOut();
                this.profileService.cleanPlayer();

              } catch (err) {
                console.log("cleaned");
              }
            }
          }
        ]
      });

      await alert.present();
    })
  }
  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('it');
    // if (this.translate.getBrowserLang() !== undefined) {
    //   this.translate.use(this.translate.getBrowserLang());
    // }
    // else {
      this.translate.use('it'); // Set your language here
    // }
  }
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
  initializeApp() {
    console.log("startup");
    this.platform.ready().then(() => {
      this.auth.startUpAsync();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
    });
  }

  logout() {
    this.authService.signOut();
    // this.storage.clear();
  }
}
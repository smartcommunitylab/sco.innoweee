import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Platform, LoadingController, ToastController, NavController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth/auth.service';
import { AuthActions } from 'ionic-appauth/lib/auth-action';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  subscription: any;
  token: any;
  navigateFirst = {
    "school-teacher": "select-class",
    "school-parent": "select-class",
    "collector-operator": "home-operator",
  }
  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private loadingController: LoadingController,
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService,
    private translate: TranslateService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    this.initializeApp();
  }

  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('it');
  }
  ngOnInit() {

   
  }
  initAuth() {
    this.subscription = this.auth.authObservable.subscribe(async (action) => {
      console.log("login back");
      console.dir(action);

      if (action.action === AuthActions.SignInSuccess) {
        console.log("SignInSuccess")
        const loading = await this.loadingController.create({
          duration: 2000
        });
        await loading.present();
        //check if profile is valid
        this.token = action.tokenResponse;
        this.profileService.getDomain(this.token.accessToken).then(res => {
          //check if domain is correct
          this.profileService.setDomainMemorized(res);
          if (this.checkProfileDomain(res)) {
            console.log("domain correct for the page")
            this.navigateToFirstPage();
          } else {
            //error
            console.log("domain not correct")
            this.router.navigate(['profile']);
            //show alert with confirm of logout
            this.showAlertDone();
            //this.presentToast("Profilo errato");
          }
        }, err => {
          //check error
          this.router.navigate(['register-parent']);
        })
      } else if (action.action === AuthActions.SignOutSuccess) {
        console.log("SignOutSuccess")

        this.router.navigate(['profile']);
      } else if (action.action === AuthActions.AutoSignInSuccess){
        console.log("AutoSignInSuccess")
        if ((this.isNotOperator(localStorage.getItem('profile')))) {
          var playerId = this.profileService.getMemorizedPlayerId();
          var playerData = this.profileService.getMemorizedPlayerData();
          var playerName = this.profileService.getMemorizedPlayerName();
          var schoolName = this.profileService.getMemorizedSchool();
          if (localStorage.getItem('profile') && playerId && playerData && playerName && schoolName) {
                this.profileService.setPlayerData(playerData);
                this.profileService.setPlayerName(playerName);
                this.profileService.setSchoolName(schoolName);
                this.router.navigate(['home'], { queryParams: { playerId: playerId, playerName: playerName, playerData: JSON.stringify(playerData) } });
              } 
        } else {
          this.router.navigate(['home-operator']);
        }
      } else {
        console.log("Default")
        if (!navigator.onLine) {
          this.presentToast("Connessione assente");

        }
      }
    });
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
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000,
      position: 'middle'

    })
    toast.present();
  }
  navigateToFirstPage() {
    var selected = this.profileService.getProfileRole();
    // console.log("struct:"+JSON.stringify(this.navigateFirst));
    console.log("selected:" + selected);
    this.navCtrl.navigateRoot(this.navigateFirst[selected]);
    // this.router.navigate([this.navigateFirst[selected]]);
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
  initializeApp() {
    this.platform.ready().then(() => {
      this.auth.startUpAsync();
      console.log('ready');
      this.initAuth();
      this.splashScreen.hide();
      this.initTranslate();

    });
  }
  
  private isNotOperator(arg0: string) {
    if ((arg0 != this.profileService.getOwnerKey()) && (arg0 != this.profileService.getOperatorKey()))
      return true;
    return false
  }
}
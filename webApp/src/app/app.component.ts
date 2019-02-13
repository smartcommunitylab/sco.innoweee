import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  styleUrls: ['./app.component.scss'],
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public language : string='en';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private authService: AuthenticationService,
    private translate: TranslateService) {

    this.initializeApp();
  }
  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    }
    else {
      this.translate.use('en'); // Set your language here
    }
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
      this.authenticationService.authenticationState.subscribe(state => {
        if (state) {
          this.router.navigate(['members', 'game-selection']);
        } else {
          this.router.navigate(['login']);
        }
      });

    });
  }

  public changeLanguage() : void
  {
     this.translateLanguage();
  }



  private translateLanguage() : void
  {
     this.translate.use(this.language);
  }
  logout() {
    this.authService.logout();
  }
}
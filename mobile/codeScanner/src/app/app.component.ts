import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';
 
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
 
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private translate: TranslateService
  ) {
    this.initializeApp();
  }

  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('it');
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initTranslate();
      // this.authenticationService.authenticationState.subscribe(state => {
      //   if (state) {
      //     this.router.navigate(['members', 'select-class']);
      //   } else {
      //     this.router.navigate(['login']);
      //   }
      // });
 
    });
  }
}
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
const ROUTER_KEY= "router-key"

@Component({
  styleUrls: ['./app.component.scss'],
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {
  // public language: string = 'en';
  title = "";
  // routerState="game-selection";
  // onClassSelected(title: string) {
  //   this.title = title;
  // }
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authenticationService: AuthenticationService,
    private router: Router,
    private storage:Storage,
    private authService: AuthenticationService,
    private translate: TranslateService) {

    this.initializeApp();
  }

  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('it');
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
          this.storage.get(ROUTER_KEY).then(res => {
            if (res)
              // this.router.navigate(['members', res]);
              this.router.navigate(['members', 'home']);
              else 
                this.router.navigate(['members', "game-selection"]);
                
          })
           
        } else {
          this.router.navigate(['login']);
        }
      });

    });
  }

  logout() {
    this.authService.logout();
    this.storage.clear();
  }
}
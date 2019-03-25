import {  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/authentication.service';

const ROUTER_KEY= "router-key"


export class MainPage implements OnInit {

  constructor(
    public translate: TranslateService,
    public authService: AuthenticationService,
    public storage:Storage) {
      this.initTranslate();
     }
  public language: string = 'it';

  ngOnInit() {
  }
  
  public setRoute(route) {
    this.storage.set(ROUTER_KEY,route);

  }
  public changeLanguage(): void {
    this.translateLanguage();
  }
  
  public logout() {
    this.authService.logout();
    this.storage.clear();
  }
  private translateLanguage(): void {
    this.translate.use(this.language);
  }
  private initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang(this.language);
  //   if (this.translate.getBrowserLang() !== undefined) {
  //     this.translate.use(this.translate.getBrowserLang());
  //   }
  //   else {
  //     this.translate.use('en'); // Set your language here
  //   }
   }
}
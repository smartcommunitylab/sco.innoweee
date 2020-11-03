import {  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { AuthService } from '../auth/auth.service';

const ROUTER_KEY= "router-key"


export class MainPage implements OnInit {

  constructor(
    public translate: TranslateService,
    public authService: AuthService,
    public storage:Storage,
    public navCtrl: NavController
    ) {
      this.initTranslate();
     }
  public language: string = 'it';

  ngOnInit() {
    this.language=this.translate.currentLang;
  }
  ionViewDidEnter() {
    this.language=this.translate.currentLang;
  }
  public setRoute(route) {
    this.storage.set(ROUTER_KEY,route);

  }
  public changeLanguage(): void {
    this.translateLanguage();
  }
  
  public logout() {
    this.authService.signOut();
    // this.storage.clear();
  }
  public goBack() {
    this.navCtrl.pop();
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
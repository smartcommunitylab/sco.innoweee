import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

/**
 * Page to handle end session callback for browser-based version.
 * Should be customized by the app to handle app-specific redirects.
 */
@Component({
  template: '<p>Signing Out...</p>'
})
export class EndSessionPage implements OnInit {

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.authService.EndSessionCallBack();
    this.storage.clear();
    this.navCtrl.navigateRoot('login');
  }

}

import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage extends CommonPage implements OnInit {
  playerData: any;
  stat: any;
  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private loadingController: LoadingController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();

  }
  async ngOnInit() {
    this.presentLoading();
    // this.profileService.getLocalPlayerData().then(async res => {
    //   this.playerData = res;
    // this.profileService.getPlayerData()
    const token = await this.auth.getValidToken();
    this.dataServerService.getOperatorStats(this.profileService.getDomainMemorized()["tenants"][0],this.profileService.getCollector(), token.accessToken).then(res => {
      console.log(JSON.stringify(res));
      if (res)
      this.stat=res;
    })
    // })
  }
home(){
  this.navCtrl.navigateRoot('home-operator');
}

  getFooter() {
    //  return (this.getSchoolName())
  }


}

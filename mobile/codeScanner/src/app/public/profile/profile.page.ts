import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Platform, ToastController } from '@ionic/angular';
import { AuthActions } from 'ionic-appauth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  playerName: any;
  navCtrl: any;

  constructor(
    private profileService: ProfileService,
    private auth: AuthService,
    private platform: Platform,
    private router: Router,
    private translate: TranslateService,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      var playerId = this.profileService.getMemorizedPlayerId();
      var playerData = this.profileService.getMemorizedPlayerData();
      var playerName = this.profileService.getMemorizedPlayerName();
      var schoolName = this.profileService.getMemorizedSchool();
      if ((this.isNotOperator(localStorage.getItem('profile')))) {
        console.log('teacher or parent')

      if (localStorage.getItem('profile') && playerId && playerData && playerName && schoolName) {
          this.profileService.setPlayerData(playerData);
          this.profileService.setPlayerName(playerName);
          this.profileService.setSchoolName(schoolName);
          this.router.navigate(['home'], { queryParams: { playerId: playerId, playerName: playerName, playerData: JSON.stringify(playerData) } });
        } 

      }
      else {
        console.log('operator')
        this.router.navigate(['home-operator']);
      }
    })
  }
  private isNotOperator(arg0: string) {
    if ((arg0 != this.profileService.getOwnerKey()) && (arg0 != this.profileService.getOperatorKey()))
      return true;
    return false
  }


  playerData(playerData: any): any {
    throw new Error("Method not implemented.");
  }


  chooseProfile(profile: string) {
    this.profileService.setProfileRole(profile);
    //try to access to url
    this.profileService.checkServer().then(()=>{
      this.router.navigate(['login']);
    }, err =>{
      //error with connection
      this.translate.get('toast_error').subscribe(async (res: string) => {
        const toast = await this.toastController.create({
          message: res,
          duration: 2000
        })
        toast.present();
      })
    })
  }

}

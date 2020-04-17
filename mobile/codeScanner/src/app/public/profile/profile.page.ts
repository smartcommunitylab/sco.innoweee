import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Platform, ToastController, ModalController, NavController } from '@ionic/angular';
import { AuthActions } from 'ionic-appauth';
import { TranslateService } from '@ngx-translate/core';
import { CommonPage } from 'src/app/class/common-page';
import { DataServerService } from 'src/app/services/data.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClassificationService } from 'src/app/services/classification.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage extends CommonPage implements OnInit {
  playerName: any;

  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public auth:AuthService,
    public dataServerService: DataServerService,
    private _cdr: ChangeDetectorRef,
    private modalController: ModalController,
    public location:Location,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public classificationService: ClassificationService,
    private navCtrl: NavController

  ) {
    super( auth,router,translate, toastController,route,dataServerService,location,profileService,authService) }

  async ngOnInit() {
    // this.auth.authObservable.subscribe((action) => {
    //   var playerId = this.profileService.getMemorizedPlayerId();
    //   var playerData = this.profileService.getMemorizedPlayerData();
    //   var playerName = this.profileService.getMemorizedPlayerName();
    //   var schoolName = this.profileService.getMemorizedSchool();
    //   if ((this.isNotOperator(localStorage.getItem('profile')))) {
    //     console.log('teacher or parent')

    //   if (localStorage.getItem('profile') && playerId && playerData && playerName && schoolName) {
    //       this.profileService.setPlayerData(playerData);
    //       this.profileService.setPlayerName(playerName);
    //       this.profileService.setSchoolName(schoolName);
    //       this.router.navigate(['home'], { queryParams: { playerId: playerId, playerName: playerName, playerData: JSON.stringify(playerData) } });
    //     } 

    //   }
    //   else {
    //     console.log('operator')
    //     this.router.navigate(['home-operator']);
    //   }
    // })
  }
  // private isNotOperator(arg0: string) {
  //   if ((arg0 != this.profileService.getOwnerKey()) && (arg0 != this.profileService.getOperatorKey()))
  //     return true;
  //   return false
  // }


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
          duration: 2000,
          position: 'middle'
        })
        toast.present();
      })
    })
  }

}

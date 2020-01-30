import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DataServerService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from '@ionic/angular';
import { CommonPage } from 'src/app/class/common-page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manual-insert',
  templateUrl: './manual-insert.page.html',
  styleUrls: ['./manual-insert.page.scss'],
})
export class ManualInsertPage extends CommonPage implements OnInit {
  scanData: any = null;
  playerId: any;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController:AlertController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
   }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.playerId = params.playerId;
    })
  }
  async insertCode() {
    //check if it is already inserted
    const token = await this.auth.getValidToken();
    this.dataServerService.checkIfPresent(this.scanData,this.profileService.getPlayerData()["objectId"],token.accessToken).then(res => {
      // if (res) {
      //   //ok
      //   this.showDoubleId();
      // }
      // else {
        //already used
        this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })  }
      // }  
    ), err => {
        //presente con altro player id? Eccezione
    }}
  showDoubleId() {
    this.translate.get('classification_double_id_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('classification_double_id_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      });

      await alert.present();
    })  }
    getFooter() {
      return (this.getSchoolName())
    }
  
    getSchoolName() {
      return this.profileService.getSchoolName();
    }
  }

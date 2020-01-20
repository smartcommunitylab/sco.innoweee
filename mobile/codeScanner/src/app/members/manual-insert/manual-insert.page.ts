import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthService } from 'src/app/auth/auth.service';
import { DataServerService } from 'src/app/services/data.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ClassificationService } from 'src/app/services/classification.service';

@Component({
  selector: 'app-manual-insert',
  templateUrl: './manual-insert.page.html',
  styleUrls: ['./manual-insert.page.scss'],
})
export class ManualInsertPage implements OnInit {
  scanData: any = null;
  playerId: any;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private classificationService:ClassificationService,
    private alertController:  AlertController,
    private auth: AuthService,
    private dataServerService: DataServerService,
    private profileService: ProfileService
    ) { }

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
      if (res) {
        //ok
        this.showDoubleId();
      }
      else {
        //already used
        this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })  }
      }  
    )}
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

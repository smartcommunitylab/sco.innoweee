import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, AlertController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { ClassificationService } from 'src/app/services/classification.service';
import { ItemClassification } from 'src/app/class/item-classification';

@Component({
  selector: 'app-classification-type',
  templateUrl: './classification-type.page.html',
  styleUrls: ['./classification-type.page.scss'],
})
export class ClassificationTypePage extends CommonPage implements OnInit {
  items: string[];
  answer: any[] = [];
  playerData: any;
  garbageMap: any;
  garbageCollectionName: any;
  private itemClassification:ItemClassification;
  recap: any = {};
  constructor(public router: Router,
    public translate: TranslateService,
    private alertController: AlertController,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    public profileService: ProfileService,
    private classificationService: ClassificationService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }


  ngOnInit() {
    this.profileService.getLocalPlayerData().then(async res => {
      this.playerData = res;
      const token = await this.auth.getValidToken();
      // this.authService.getValidAACtoken().then( token => {
      this.dataServerService.getActualCollection(this.playerData.gameId, token.accessToken).then(collection => {
        if (collection) {
          this.items = collection.items
          this.garbageCollectionName = collection.nameGE;
          this.dataServerService.getGargabeMap(this.playerData.tenantId, token.accessToken).then(garbage => {
            this.garbageMap = garbage.items;
            this.fillSteps();
          });
        } else {
          this.translate.get('wrong_data_server').subscribe(async (res: string) => {
            const toast = await this.toastController.create({
              message: res,
              duration: 2000
            })
            toast.present();
          })
        }
      });
    });
  }
  async openInfo() {
    this.translate.get('classification_type_alert_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('classification_type_alert_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      });
  
      await alert.present();
    })
  }
  getLabel(item) {
    if (this.answer && this.answer[item] && this.translate)
      return this.translate.instant(this.answer[item].label[this.translate.defaultLang]);
  }

  fillSteps() {

    this.items.forEach(element => {
      this.answer.push({
        "label": {
          "it": this.garbageMap[element].name.it,
          "en": this.garbageMap[element].name.en
        },
        "value": element
      })
    });
  }
  chooseCategory(item) {
    this.classificationService.itemClassification.setItemType(item.value);
    this.classificationService.itemClassification.setItemValue(this.getLabel(item.key));
    this.router.navigate(['classification-working']);
  }

}

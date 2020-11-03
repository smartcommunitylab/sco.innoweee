import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/auth/auth.service';
import { ClassificationService } from 'src/app/services/classification.service';
import { ItemClassification } from 'src/app/class/item-classification';
import { ModalCategory } from './modal/modalCategory';

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
    private modalController: ModalController,
    public loadingController: LoadingController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();

  }
  ngOnInit() {
    this.presentLoading();
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
              duration: 2000,
              position: 'middle'
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
  getLabel(item, modal) {
    console.log(JSON.stringify(item))
    if (!modal)
   { if (this.answer && this.answer[item] && this.translate)
      return this.translate.instant(this.answer[item].label[this.translate.defaultLang]);}
    else return this.translate.instant(item.label[this.translate.defaultLang]);
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
    this.classificationService.itemClassification.setItemValue(this.getLabel(item.key, false));
    this.router.navigate(['classification-working']);
  }
  getFooter() {
    return (this.getClassName()) +' - '+(this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
  getClassName() {
    return this.profileService.getPlayerName();

  }
  otherIsVisible() {
    if (this.garbageCollectionName && this.garbageCollectionName.toLowerCase()=="r6")
    {
      return true;
    }
    return false;
  }
  otherCategory() {
    this.openModal()
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalCategory,
      // backdropDismiss:false,
      cssClass: 'modal-category',
      componentProps: {
        // "paramID": 123,
        // "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
        // console.log(dataReturned)
        // if (dataReturned.data["itemType"])
        //   this.chooseCategory(dataReturned.data["itemType"]);
        // if (dataReturned.data["timestamp"])
        //   this.item.timestamp = dataReturned.data["timestamp"]
          this.classificationService.itemClassification.setItemType(dataReturned.data["itemType"].value);
    this.classificationService.itemClassification.setItemValue(this.getLabel(dataReturned.data["itemType"],true));
    this.router.navigate(['classification-working']);

      }
    });

    return await modal.present();
  }
}

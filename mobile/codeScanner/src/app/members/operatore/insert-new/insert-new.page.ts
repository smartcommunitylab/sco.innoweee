import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, NavController, ModalController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InsertModalCategory } from './modal/insertModalCategory';

@Component({
  selector: 'app-insert-new',
  templateUrl: './insert-new.page.html',
  styleUrls: ['./insert-new.page.scss'],
})
export class InsertNewPage extends CommonPage implements OnInit {
  itemId: any;
  typeItem: any;
  workingConfirm: boolean;
  note: any;
  typeString: any;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private navCtrl: NavController,
    private modalController: ModalController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  async ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.scanData) {
          this.itemId = params.scanData;
        }
      })
  }

  getType() {
    if (this.typeItem)
      return this.typeItem.name["it"];
    else return ""
  }

  cancel() {
    this.navCtrl.navigateRoot('home-operator');
  }



  confirmItem() {
    this.translate.get('label_classify').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('label_conferma_operatore');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        backdropDismiss: false,
        buttons: [
          {
            text: 'Annulla',
            cssClass: 'secondary',
            handler: () => {
              this.router.navigate(['home']);
            }
          }, {
            text: 'Conferma',
            handler: async () => {
              console.log('conferma')
              const token = await this.auth.getValidToken();
              this.dataServerService.unexpetedItemOperator(this.profileService.getDomainMemorized()["tenants"][0], token.accessToken, this.itemId, this.workingConfirm, this.profileService.getCollector(), this.typeItem.itemId, this.note).then(() => {
                this.showToastConfirmed()
                this.router.navigate(['checked']);
              }, err => {

              })
              //call @PutMapping(value = "/api/collector/item/{tenantId}/check")
            }
          }
        ]
      });

      await alert.present();
    })
    // popup confirm
  }
  showToastConfirmed() {
    this.translate.get('object_inserted').subscribe(async res => {

      const toast = await this.toastController.create({
        message: res,
        duration: 2000
      })
      toast.present();
    })
    }  
  chooseType() {
    this.openModal()
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: InsertModalCategory,
      // backdropDismiss:false,
      cssClass: 'modal-category',
      componentProps: {
        // "paramID": 123,
        // "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null && dataReturned.data["itemType"] !=null) {
        console.log(dataReturned.data["itemType"].value);
        var type = dataReturned.data["itemType"]
        this.typeItem = type.value;
        this.typeString = type.label[this.translate.defaultLang];
      }
    });

    return await modal.present();
  }

  confirm() {
    //call  @PutMapping(value = "/api/collector/item/{tenantId}/unexpected")
  }
  getFooter() {
    return (this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';
import { CatalogService } from 'src/app/services/catalog.service';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

const FOLDER_COMPONENTS = "./assets/images/components/";

@Component({
  selector: 'app-change',
  templateUrl: './change.page.html',
  styleUrls: ['./change.page.scss'],
})

export class ChangePage extends MainPage implements OnInit {
  profileData = null;
  profileState = null;
  catalog: any = null;
  filteredCatalog = [];
  selection = null;
  trying = false;
  tmprobot = null;
  mapUri: any;

  constructor(public translate: TranslateService,
    public storage: Storage,
    public toastController: ToastController,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public navCtrl: NavController,
    private alertController: AlertController,
    public catalogService: CatalogService) {
    super(translate, authService, storage);
  }

  ngOnInit() {
    super.setRoute("myrobot");
    this.mapUri = {};

  }

  ionViewWillEnter() {
    this.profileService.getLocalPlayerData().then(res => {
      //get data and robot
      this.profileData = res
      this.catalogService.getCatalog(this.profileData.tenantId).then(res => {
        this.catalog = res;
      })
      this.resetetMapImage();

    });
    this.profileService.getLocalPlayerState().then(res => {
      //get resources and coins
      this.profileState = res
    });
  }
  private resetetMapImage() {
    this.tmprobot = (JSON.parse(JSON.stringify(this.profileData.robot)));
    Object.keys(this.tmprobot.components).forEach(key => {
      this.mapUri[this.tmprobot.components[key].type] = this.tmprobot.components[key].imageUri;
    })
  }
  getImgDefault(piece) {
    return FOLDER_COMPONENTS + piece + 'bw.png'
  }
  getImgNewComponent(piece) {
    return FOLDER_COMPONENTS + piece.imageUri;

  }
  backPage() {
    this.selection = null;

  }
  cancelSelection() {
    this.trying = false;
    this.resetetMapImage();
  }
  getResourceValue(label) {
    if (this.profileState)
      return this.profileState[label];
    else return ""
  }

  getImg(piece) {
    return FOLDER_COMPONENTS + this.mapUri[piece];
  }
  select(selection) {
    this.selection = selection;
    this.filterItems(selection)
  }
  deleteSelecttion() {
    this.selection = null;
    this.tmprobot = this.profileData.robot
  }
  private filterItems(selection) {
    this.filteredCatalog = [];
    let myComponentId = Object.keys(this.profileData.robot.components).find(k => this.profileData.robot.components[k].type === selection)
    if (this.catalog) {
      //for every component of catalog.components
      Object.keys(this.catalog.components).forEach(key => {
        let value = this.catalog.components[key];
        if (value.parentId == myComponentId && value.type == selection) {
          this.filteredCatalog.push(value);
        }
        console.log(key, value);

      });
    }


  }
  getResourceValueItem(item, label) {
    return item.costMap[label];
  }
  async tryItem(item) {
    if (this.isBuyable(item)) {
      //change it without buy it
      this.tmprobot.components[item.parentId] = item;
      this.mapUri[item.type] = item.imageUri;
      this.trying = true;
    }
    else {
      this.translate.get('cannot_try_resource').subscribe((res: string) => {
        this.presentToast(res)
      });

    }
  }
  // tryingItem(item) {
  //   return this.tmprobot.components[item.id] == item.id;
  // }
  isBuyable(item) {
    //check if I have all the three coins
    if ((item.costMap['recycleCoin'] > this.profileState['recycleCoin']) ||
      (item.costMap['reduceCoin'] > this.profileState['reduceCoin']) ||
      (item.costMap['reuseCoin'] > this.profileState['reuseCoin'])) {
      return false
    }
    return true
  }
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
  buyItem(item) {
    if (this.isBuyable(item)) {
      this.confirmBuy(item).then(res => {
        console.log(res);
      })
    }
  }
  async confirmBuy(item) {
    let a: any = {};

    this.translate.get('confirm_buy_title').subscribe(t => {
      a.title = t;
    });

    this.translate.get('confirm_buy_message').subscribe(t => {
      a.message = t;
    });
    this.translate.get('cancel_popup').subscribe(t => {
      a.cancel = t;
    });
    this.translate.get('ok_popup').subscribe(t => {
      a.ok = t;
    });

    const alert = await this.alertController.create({
      header: a.title,
      message: a.message,
      buttons: [
        {
          text: a.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: a.ok,
          handler: () => {
            this.catalogService.buyComponent(item, this.profileData.gameId, this.profileData.objectId).then(newRobot => {
              // //robot changed 
              //if not try, change it and buy it
              if (!this.trying) {
                this.tmprobot.components[item.parentId] = item;
                this.mapUri[item.type] = item.imageUri;
              }
              this.profileService.setNewRobot(newRobot).then(res => {
                this.tmprobot = newRobot;
                this.profileService.getLocalPlayerData().then(res => {
                  //get data and robot
                  this.profileData = res
                  this.filterItems(this.selection);
                  if (this.trying) {
                    this.trying = false;
                  }
                  //load new components
                });
              })
              this.profileService.getPlayerState(this.profileData.gameId, this.profileData.objectId).then(res => {
                this.profileState = res;
                this.profileService.setPlayerState(res);
              });
            })
          }
        }
      ]
    });
    return await alert.present();
  }
  getFooter() {
    return (this.translate.instant('footer_game_title')+" | "+this.getSchoolName()+" | "+this.getClassName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

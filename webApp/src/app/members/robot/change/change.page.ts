import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';
import { CatalogService } from 'src/app/services/catalog.service';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
import { GameService } from 'src/app/services/game.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { AuthService } from 'src/app/auth/auth.service';

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
  tryItemId = null;
  tmprobot = null;
  mapUri: any;
  mapBuyable = {};
  actualCollection: any;

  constructor(public translate: TranslateService,
    public storage: Storage,
    public toastController: ToastController,
    public profileService: ProfileService,
    public authService: AuthService,
    private garbageService: GarbageCollectionService,
    public navCtrl: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private gameService: GameService,
    private auth: AuthService,
    public catalogService: CatalogService) {
    super(translate, authService, storage, navCtrl);
  }

  ngOnInit() {
    super.ngOnInit();
    super.setRoute("myrobot");
    this.mapUri = {};

  }
  enableButtons() {
    this.partEnabled('armR');
    this.partEnabled('armL');
    this.partEnabled('chest');
    this.partEnabled('head');
    this.partEnabled('legs');
  }
  ionViewWillEnter() {
    super.ionViewDidEnter();
    this.profileService.getLocalPlayerData().then(async res => {
      //get data and robot
      this.profileData = res
      const token = await this.auth.getValidToken();
      this.catalogService.getCatalog(this.profileData.tenantId,this.profileData.gameId,token.accessToken).then(res => {
        this.catalog = res;
        this.enableButtons();
        this.garbageService.getActualCollection(this.profileData.gameId,token.accessToken).then(res => {
          this.actualCollection = res;
        })
      })
      this.resetetMapImage();
    });
    this.updateState();
  }
  partEnabled(selection) {
    this.mapBuyable[selection] = false;
    if (this.profileData && this.profileData.robot && this.profileData.robot.components && this.catalog) {
      let myComponentId = Object.keys(this.profileData.robot.components).find(k => this.profileData.robot.components[k].type === selection)
      // let catalog=this.catalog.components;
      // for (let key of  catalog){
      Object.keys(this.catalog.components).forEach(key => {
        let value = this.catalog.components[key];
        if (value.parentId == myComponentId && value.type == selection) {
          if (this.isBuyable(value))
            this.mapBuyable[selection] = true;


        }

      });
    }

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

  async donateConfirm() {
    var header = "";
    var message = "";
    this.translate.get('header_confirm').subscribe(async (res: string) => {
      var yesLabel = this.translate.instant('reply_yes_question');
      var noLabel = this.translate.instant('reply_no_question');
      header = res;
      message = this.translate.instant("message_confirm");
      const alert = await this.alertController.create({
        header: header,
        message: message,
        cssClass: 'alert-donate',
  
        buttons: [
          {
            text: noLabel,
            role: 'cancel',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: yesLabel,
            handler: () => {
              console.log('Confirm Okay');
              this.confirm();
            }
          }
        ]
      });
  
      await alert.present();
    });
    
  }
  async donated(res) {
    var header = "";
    var message = "";
    this.profileService.setPlayerData(res);
    this.translate.get('header_donated').subscribe(async (header: string) => {
      header = header;
      var classi ="";
      var indexContribution =  this.actualCollection.nameGE.replace(/\D/g,'');
      if (res.contributions[+indexContribution-1] && res.contributions[+indexContribution-1].donatedPoints)
      // message = this.translate.instant("message_donated");
      for (let index = 0; index < res.contributions[+indexContribution-1].donatedPoints.length; index++) {
         classi = classi + " " +res.contributions[+indexContribution-1].donatedPoints[index].playerName;
      }
      this.translate.get('message_donated', { classe: classi }).subscribe(async (s: string) => {
        message= s;
        const alert = await this.alertController.create({
          header: header,
          message: message,
          cssClass: 'alert-donated',
    
          buttons: [
            { text: 'OK',
              role: 'cancel',
              handler: (blah) => {
                //this.updateState();
                this.changePoints();
                this.updateDate(res);
              }
            }
          ]
        });
    
        await alert.present();
      });
      
    });
    
  }
  changePoints() {
     this.profileService.getLocalPlayerState().then(res => {
      //get resources and coins
      this.profileState = res
      this.profileState.recycleCoin=0;
      this.profileState.reduceCoin=0;
      this.profileState.reuseCoin=0;
      this.profileService.setLocalPlayerState(this.profileState);
    }, err => {
    });
  }
  updateDate(res: any) {
    this.profileData =res;
  }
  notYetDonateOrNotZero() {
    if (this.profileState && this.profileState.recycleCoin==0 && this.profileState.reduceCoin==0 && this.profileState.reuseCoin==0)
       return false;
    if (this.profileData && this.profileData.contributions && this.actualCollection)
      for (let index = 0; index < this.profileData.contributions.length; index++) {
        const element = this.profileData.contributions[index];
        if (this.actualCollection.nameGE == element.garbageCollectionName)
        return (element.donatedPoints.length == 0)
      }
      return true
  }
  async confirm() {
    //send contribution
    //loading
    const loading = await this.loadingController.create({
    });
    this.presentLoading(loading);
    const token = await this.auth.getValidToken();
    this.gameService.sendContribution(this.profileData.gameId,this.profileData.objectId,this.actualCollection.nameGE,token.accessToken).then(res=>{
      console.log(res)
      //popup con info sulla classe -> prendo array donate e scrivo le classi
        this.donated(res)
        loading.dismiss();
    }, err => {
      loading.dismiss();
      this.translate.get('donate_server_error').subscribe(res => {
        this.presentToast(res)
      })
    })
  }

  donate() {
    //open popup for confirm
    this.donateConfirm();
  }
  backPage() {
    this.deleteSelecttion();
    this.cancelSelection();

  }
  cancelSelection() {
    this.trying = false;
    this.tryItemId = null;
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
        // console.log(key, value);

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
      this.tryItemId = item.componentId;
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
          handler: async () => {
            const loading = await this.loadingController.create({
            });
            this.presentLoading(loading);
            const token = await this.auth.getValidToken();
            this.catalogService.buyComponent(item, this.profileData.gameId, this.profileData.objectId,token.accessToken).then(async newRobot => {
              // //robot changed 
              //if not try, change it and buy it
              if (!this.trying) {
                this.tmprobot.components[item.parentId] = item;
                this.mapUri[item.type] = item.imageUri;
              }
              //this.updateState();
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
                  loading.dismiss();
                }, err => {
                  loading.dismiss();
                });
              }, err => {
                loading.dismiss();
              })
              const token = await this.auth.getValidToken();
              this.profileService.getPlayerState(this.profileData.gameId, this.profileData.objectId,token.accessToken).then(res => {
                this.profileState = res;
                this.profileService.setPlayerState(res);
                this.enableButtons();

                loading.dismiss();
              }, err => {
                loading.dismiss();
              });
            })
          }
        }
      ]
    });
    return await alert.present();
  }
  async presentLoading(loading) {
    return await loading.present();
  }
  updateState(): Promise<any> {
    return this.profileService.getLocalPlayerState().then(res => {
      //get resources and coins
      this.profileState = res
      return Promise.resolve();
    }, err => {
      return Promise.reject();
    });
  }
  getFooter() {
    return (this.translate.instant('footer_game_title') + " | " + this.getSchoolName() + " | " + this.getClassName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
  tryingItem(item) {
    return (this.trying && item.componentId == this.tryItemId)
  }
  buyableItem(item) {
    return (this.trying && item.componentId != this.tryItemId)
  }
}

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ProfileService } from 'src/app/services/profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';
import { environment } from './../../../../environments/environment';
import { UtilsService } from 'src/app/services/utils.service';
import { AuthService } from 'src/app/auth/auth.service';

var ITEM_STATE_CLASSIFIED = 1;
var ITEM_STATE_CONFIRMED = 2;
@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage extends MainPage implements OnInit {
  @ViewChild('manualID') manualID;

  private itemSocketURL;
  private apiEndpoint;
  // greetings: string[] = [];
  // showConversation: boolean = false;
  ws: any;
  name: string;
  disabled: boolean;
  message: any;
  playerData: any;
  manualItemId: string;
  garbageCollectionName: string;
  weeklyGarbage: string;
  manual: boolean;
  subscription: any;
  paramsub: any;
  itemId: any;
  constructor(
    private toastController:ToastController,
    private profileService: ProfileService,
    private router: Router,
    public translate: TranslateService,
    public authService: AuthService,
    public storage: Storage,
    private utils:UtilsService,
    private garbageCollection: GarbageCollectionService,
    private alertController: AlertController,
    private auth: AuthService,
    public navCtrl: NavController) {
    super(translate, authService, storage, navCtrl);

    this.itemSocketURL = environment.itemSocketURL;
    this.apiEndpoint = environment.apiEndpoint;
  }

  ionViewWillEnter() {
    this.manual = false;
    this.message = null;

    this.manualItemId = "";
    this.profileService.getLocalPlayerData().then(async res => {
      this.playerData = res;
      this.connect(this.playerData.tenantId, this.playerData.objectId);
      const token = await this.auth.getValidToken();
      this.garbageCollection.getActualCollection(this.playerData.gameId,token.accessToken).then(res => {
        this.garbageCollectionName = res.nameGE;
        this.weeklyGarbage = res.message
      });
    })
  }


  getWantedMessage() {
    if (this.weeklyGarbage)
      return this.weeklyGarbage[this.translate.currentLang];
    else return ""
  }
  ionViewWillLeave() {
    this.disconnect();
  }
  connect(tenantId, playerId) {
    //connect to stomp where stomp endpoint is exposed
    let sock = new SockJS(this.apiEndpoint + this.itemSocketURL);
    // let sock = new WebSocket("ws://localhost:2020/itemws/websocket");
    this.ws = Stomp.over(sock);
    let that = this;
    this.ws.connect({}, (frame) => {
      that.ws.subscribe("/errors", (message) => {
         console.log("Error " + message.body);
      });
      this.subscription = that.ws.subscribe("/topic/item." + tenantId + "." + playerId, (message) => {
        console.log(message)
        that.message = JSON.parse(message.body);
        if (that.message && that.message.itemId) {
          //go to item-loaded
        this.checkIfPresent(that.message.itemId,).then(res => {
        if (!res) {
          //new item
          this.router.navigate(['item-loaded', that.message.itemId, false]);

        }
        else if (this.itemClassified(res)) {
          this.confirm(res);
          // this.router.navigate(['item-confirm',  JSON.stringify(res)]);

        } else {
          this.showErrorItem(res);
        }
      })
          // that.router.navigate(['item-loaded', that.message.itemId, false]);
        }
      });
      that.disabled = true;
    }, function (error) {
      console.log("STOMP error " + error);
    });
  }

  // ionViewDidLeave() {
  //   this.subscription.unsubscribe();
  // }
  enableManual() {
    this.manual = true;
    setTimeout(() => {
      this.manualID.setFocus();
    }, 300);
    // this.manualID.setFocus();
  }
  manualInsert() {
    console.log("insert");
    if (this.manualItemId) {
      if (this.manualItemId.length == 5) {

      //go to item-loaded
      this.checkIfPresent(this.manualItemId).then(res => {
        if (!res) {
          //new item
          this.router.navigate(['item-loaded', this.manualItemId, true]);
        }
        else if (this.itemClassified(res)) {
          //confirm item
          this.confirm(res);
          //this.router.navigate(['item-confirm',  JSON.stringify(res)]);

        } else {
          this.showErrorItem(res);
        }
      })
      //todo check if id is already present

    }
   
       
    else {
      this.translate.get('wrong_length_id').subscribe(res => {
        this.presentToast(res)
      })
    }
  }
  }
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
  itemClassified(res: any) {
    return (res.state == ITEM_STATE_CLASSIFIED)
  }

  confirm(item) {
    this.profileService.getLocalPlayerData().then(async res => {
      this.playerData = res;
      const token = await this.auth.getValidToken();
      this.garbageCollection.confirmItem(item.itemId, this.playerData.objectId,token.accessToken).then(res => {
        //show alert confirmed and go out
        console.log('confermato');
        item.reusable = res.reusable;
        item.valuable = res.valuable
        this.router.navigate(['item-classification', JSON.stringify(item)]);
      }, err => {
        this.utils.handleError(err);
      })
    })
  }
  async showErrorItem(item) {
    var state = this.calculateState(item)
    let headerLabel = this.translate.instant("duplicate_id_header");
    let subtitleLabel = this.translate.instant("duplicate_id_subtitle");
    let messageLabel = this.translate.instant("duplicate_id_message", { id: item.itemId, state: state });

    const alert = await this.alertController.create({
      header: headerLabel,
      subHeader: subtitleLabel,
      message: messageLabel,
      buttons: ['OK']
    });

    await alert.present();
  }
  private calculateState(item: any) {
      if (item && item.valuable) {
        return this.translate.instant("label_bin_value");
  
      }
      if (item && item.reusable) {
        return this.translate.instant("label_bin_reuse");
      }
      return this.translate.instant("label_bin_recycle");
   }

  async checkIfPresent(scanData): Promise<any> {
    const token = await this.auth.getValidToken();
    return this.garbageCollection.checkIfPresent(scanData, this.playerData.objectId,token.accessToken).then(res => {
      console.log(res);
      return res
    })
  }

  disconnect() {
    if (this.ws != null) {
      this.ws.ws.close();
    }
    this.setConnected(false);
    console.log("Disconnected");
  }
  setConnected(connected) {
    this.disabled = connected;
    // this.showConversation = connected;
    // this.greetings = [];
  }
  ngOnInit() {
    super.ngOnInit();
  }
  getImgName() {
    if (this.garbageCollectionName) {
      return './assets/images/collection/' + this.garbageCollectionName.toLowerCase() + ".png";
    }
    return ""
  }
  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }

  getFooter() {
    return (this.translate.instant('footer_game_title') + " | " + this.getSchoolName() + " | " + this.getClassName())
  }

}

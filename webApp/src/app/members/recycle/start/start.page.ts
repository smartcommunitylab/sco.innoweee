import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
// import { APP_CONFIG_TOKEN, ApplicationConfig } from 'src/app/app-config';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { AlertController, NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { MainPage } from 'src/app/class/MainPage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { environment } from './../../../../environments/environment';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage extends MainPage implements OnInit {
  @ViewChild('manualID') manualID;

  private itemSocketURL;
  private apiEndpoint;
  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name: string;
  disabled: boolean;
  message: any;
  playerData: any;
  manualItemId: string;
  garbageCollectionName: string;
  weeklyGarbage: string;
  manual: boolean;
  constructor(
    private profileService: ProfileService,
    private router: Router,
    public translate: TranslateService,
    public authService: AuthenticationService,
    public storage: Storage,
    private garbageCollection: GarbageCollectionService,
    private alertController: AlertController,
    public navCtrl: NavController) {
    super(translate, authService, storage,navCtrl);

    this.itemSocketURL = environment.itemSocketURL;
    this.apiEndpoint = environment.apiEndpoint;
  }

  ionViewWillEnter() {
    this.manual = false;
    this.message = null;
    // this.manualItemId = new Date().getTime().toString();
    this.manualItemId = "";
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.connect(this.playerData.tenantId, this.playerData.objectId);
      this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
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
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/item." + tenantId + "." + playerId, function (message) {
        console.log(message)
        that.message = JSON.parse(message.body);
        if (that.message && that.message.itemId) {
          //go to item-loaded
          that.router.navigate(['item-loaded', that.message.itemId, false]);
        }
      });
      that.disabled = true;
    }, function (error) {
      console.log("STOMP error " + error);
    });
  }
  enableManual() {
    this.manual = true;
    setTimeout(() => {
      this.manualID.setFocus();
    },300);
    // this.manualID.setFocus();
  }
  manualInsert() {
    if (this.manualItemId) {
      //go to item-loaded
      this.checkIfPresent(this.manualItemId).then(res => {
        if (!res) {
          this.router.navigate(['item-loaded', this.manualItemId, true]);

        }
        else {
          this.showErrorItem();
        }
      })
      //todo check if id is already present

    }
  }

  async showErrorItem() {
    let headerLabel = this.translate.instant("duplicate_id_header");
    let subtitleLabel = this.translate.instant("duplicate_id_subtitle");
    let messageLabel = this.translate.instant("duplicate_id_message");

    const alert = await this.alertController.create({
      header: headerLabel,
      subHeader: subtitleLabel,
      message: messageLabel,
      buttons: ['OK']
    });

    await alert.present();
  }
  checkIfPresent(scanData): Promise<any> {
    return this.garbageCollection.checkIfPresent(scanData, this.playerData.objectId).then(res => {
      console.log(res);
      return res.result
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
    this.showConversation = connected;
    this.greetings = [];
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

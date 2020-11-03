import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';
import { NavController, AlertController } from '@ionic/angular';
import { environment } from './../../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/auth/auth.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { UtilsService } from 'src/app/services/utils.service';

var ITEM_STATE_CLASSIFIED = 1;
var ITEM_STATE_CONFIRMED = 2;


@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.page.html',
  styleUrls: ['./item-classification.page.scss'],
})
export class ItemClassificationPage extends MainPage implements OnInit {
  item: any;

  private itemSocketURL;
  private apiEndpoint;
  ws: any;
  message: any;
  disabled: boolean;
  playerData: any;
  subscription: any;
  paramsub: any;

  constructor(private route: ActivatedRoute,
    private garbageCollection: GarbageCollectionService,
    private utils: UtilsService,
    private auth: AuthService,
    private alertController: AlertController,
    private profileService: ProfileService,
    public navCtrl: NavController, 
    private router: Router,
    public translate: TranslateService, 
    public authService: AuthService, 
    public storage: Storage) {
    super(translate, authService, storage,navCtrl);
    this.itemSocketURL = environment.itemSocketURL;
    this.apiEndpoint = environment.apiEndpoint;
   
  }

  ngOnInit() {
    super.ngOnInit();
  }
  getColorMarker(){
    if (this.item && this.item.valuable) {
      return "marker-green"
    }
    if (this.item && this.item.reusable) {
      return "marker-blue"
    }
    return "marker-yellow"
  }
  getBinString() {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_bin_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_bin_recycle_string_reuse");
    }
    return this.translate.instant("label_bin_recycle_string_recycle");
  }
  getMarkerString() {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_marker_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_marker_recycle_string_reuse");
    }
    return this.translate.instant("label_marker_recycle_string_recycle");
  }
  
  ionViewWillEnter() {
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      this.item= JSON.parse(this.route.snapshot.paramMap.get("item"))
    }
    // this.route.queryParamMap.subscribe(params => {
    //   console.log(params);
    // });
    // this.paramsub = this.route.queryParams
    // .subscribe(params => {
    //   console.log(params); // {order: "popular"}
    //   this.item = JSON.parse(params.item);
    //   console.log(this.item); // popular
    // });
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.connect(this.playerData.tenantId, this.playerData.objectId);
    })
  }
  connect(tenantId, playerId) {
    //connect to stomp where stomp endpoint is exposed
    let sock = new SockJS(this.apiEndpoint + this.itemSocketURL);
    // let sock = new WebSocket("ws://localhost:2020/itemws/websocket");
    this.ws = Stomp.over(sock);
    let that = this;
    this.ws.connect({},  (frame) =>{
      that.ws.subscribe("/errors",  (message) => {
        alert("Error " + message.body);
      });
      this.subscription = that.ws.subscribe("/topic/item." + tenantId + "." + playerId,  (message) => {
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
 
  itemClassified(res: any) {
    return (res.state == ITEM_STATE_CLASSIFIED)
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

  ionViewWillLeave() {
    this.disconnect();
  }
  setConnected(connected) {
    this.disabled = connected;
    // this.showConversation = connected;
    // this.greetings = [];
  }
  // ionViewDidLeave() {
  //   this.subscription.unsubscribe();
  //   this.paramsub.unsubscribe();
  // }
  ionViewDidEnter() {
    super.ionViewDidEnter();
  }
  getValueString(): string {
    if (this.item && this.item.valuable) {

      return this.translate.instant("label_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");


  }
  getValueItem(): string {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_recycle_value");
    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_reuse");
    }
    return this.translate.instant("label_recycle_recycle");

  }
  getPoints(): string {
    if (this.item && this.item.reusable)
      return this.translate.instant("label_point_reusable");
    return this.translate.instant("label_point_recicle");
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
}

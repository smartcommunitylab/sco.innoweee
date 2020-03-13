import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { environment } from './../../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { AuthService } from 'src/app/auth/auth.service';
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
          that.router.navigate(['item-loaded', that.message.itemId, false]);
        }
      });
      that.disabled = true;
    }, function (error) {
      console.log("STOMP error " + error);
    });
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

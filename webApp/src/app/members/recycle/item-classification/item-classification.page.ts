import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { environment } from './../../../../environments/environment';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
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

  constructor(private route: ActivatedRoute,
    private profileService: ProfileService,
    public navCtrl: NavController, 
    private router: Router,
    public translate: TranslateService, public authService: AuthenticationService, public storage: Storage) {
    super(translate, authService, storage,navCtrl);
    this.itemSocketURL = environment.itemSocketURL;
    this.apiEndpoint = environment.apiEndpoint;
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.item = JSON.parse(params.item);
        console.log(this.item); // popular
      });
  }
  getColorMarker(){
    if (this.item.valuable) {
      return "marker-green"
    }
    if (this.item.reusable) {
      return "marker-blue"
    }
    return "marker-yellow"
  }
  getBinString() {
    if (this.item.valuable) {

      return this.translate.instant("label_bin_recycle_string_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_bin_recycle_string_reuse");
    }
    return this.translate.instant("label_bin_recycle_string_recycle");
  }
  getMarkerString() {
    if (this.item.valuable) {

      return this.translate.instant("label_marker_recycle_string_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_marker_recycle_string_reuse");
    }
    return this.translate.instant("label_marker_recycle_string_recycle");
  }
  ionViewWillEnter() {

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
  ionViewDidEnter() {
    super.ionViewDidEnter();
  }
  getValueString(): string {
    if (this.item.valuable) {

      return this.translate.instant("label_recycle_string_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");


  }
  getValueItem(): string {
    if (this.item.valuable) {

      return this.translate.instant("label_recycle_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_recycle_reuse");
    }
    return this.translate.instant("label_recycle_recycle");

  }
  getPoints(): string {
    if (this.item.reusable)
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

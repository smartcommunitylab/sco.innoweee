import { Component, OnInit, Inject } from '@angular/core';
import { WebsocketService } from 'src/app/services/websocket.service';
import { APP_CONFIG_TOKEN, ApplicationConfig } from 'src/app/app-config';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  private itemSocketURL;
  private apiEndpoint;
  greetings: string[] = [];
  showConversation: boolean = false;
  ws: any;
  name: string;
  disabled: boolean;
  message: any;
  playerData: any;
  manualItemId:string;

  constructor(
    private profileService: ProfileService,
    private router: Router,
    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig) {
    this.itemSocketURL = config.itemSocketURL;
    this.apiEndpoint = config.apiEndpoint;
  }


  connect(tenantId,playerId) {
    //connect to stomp where stomp endpoint is exposed
    let sock = new SockJS(this.apiEndpoint + this.itemSocketURL);
    // let sock = new WebSocket("ws://localhost:2020/itemws/websocket");
    this.ws = Stomp.over(sock);
    let that = this;
    this.ws.connect({}, function (frame) {
      that.ws.subscribe("/errors", function (message) {
        alert("Error " + message.body);
      });
      that.ws.subscribe("/topic/item."+tenantId+"." + playerId, function (message) {
        console.log(message)
        that.message = JSON.parse(message.body);
        if (that.message.itemId) {
          //go to item-loaded
          that.router.navigate(['members', 'item-loaded',that.message.itemId,false]);
        }
      });
      that.disabled = true;
    }, function (error) {
      alert("STOMP error " + error);
    });
  }
  manualInsert() {
    if (this.manualItemId) {
      //go to item-loaded
      this.router.navigate(['members', 'item-loaded',this.manualItemId,true]);
    }  }
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
    //tmp
    this.manualItemId=new Date().getTime().toString();
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.connect(this.playerData.tenantId,this.playerData.objectId);
    })
  }

}

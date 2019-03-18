import { Component, OnInit } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { CatalogService } from 'src/app/services/catalog.service';
import { Storage } from '@ionic/storage'
import { Router } from '@angular/router';
@Component({
  selector: 'app-question',
  templateUrl: './question.page.html',
  styleUrls: ['./question.page.scss'],
})
export class QuestionPage extends MainPage implements OnInit {
  playerData: any;
  weeklyQuestion: any;
  coinsGained:number=0;
  numberReplies:number=0;
  
  replies = {
    0: {
      answer: "reply_0_question",
      value: 1
    },
    1: {
      answer: "reply_1_question",
      value: 3
    },
    2: {
      answer:"reply_2_question",
      value: 5
    },
    3: {
      answer:"reply_3_question",
      value: 10
    }
  }
  constructor(public translate: TranslateService,
    public storage: Storage,
    public toastController: ToastController,
    public profileService: ProfileService,
    public authService: AuthenticationService,
    public navCtrl: NavController,
    private alertController: AlertController,
    private garbageCollection: GarbageCollectionService,
    private router: Router,
    public catalogService: CatalogService) {
    super(translate, authService, storage);
  }
  ngOnInit() {
    this.setRoute("home");
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
        this.weeklyQuestion = res.reduceMessage
      });
    });

  }
  getQuestionMessage() {
    if (this.weeklyQuestion)
      return this.weeklyQuestion[this.translate.currentLang];
    else return ""
  }
  getReplyMessage(reply) {
    return this.replies[reply].answer
  }
  getNumberReplies() {
    return this.numberReplies;
  }
  getNumberCoins() {
    return this.coinsGained;
  }
  addCoins(key) {
    this.coinsGained+=this.replies[key].value;
    this.numberReplies++;
  }
  goToStart() {
    this.garbageCollection.reduce(this.playerData.objectId,this.coinsGained).then(res => {
      this.router.navigate(['start']);
    })
    
  }
}


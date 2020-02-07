import { Component, OnInit } from '@angular/core';
import { MainPage } from 'src/app/class/MainPage';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, AlertController, LoadingController } from '@ionic/angular';
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
  coinsGained: number = 0;
  numberReplies: number = 0;
  credit = false;
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
      answer: "reply_2_question",
      value: 5
    },
    3: {
      answer: "reply_3_question",
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
    private loadingController:LoadingController,
    public catalogService: CatalogService) {
    super(translate, authService, storage,navCtrl);
  }
  ngOnInit() {
    super.ngOnInit();
    this.setRoute("home");
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
        if (res && res.reduceMessage) {
          this.weeklyQuestion = res.reduceMessage
        }
      });
      this.garbageCollection.getCredit(this.playerData.gameId,this.playerData.objectId).then(res => {
        console.log(JSON.stringify(res));
      });
      
    });

  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
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
    this.coinsGained += this.replies[key].value;
    this.numberReplies++;
  }
  async goToStart() {
    const loading = await this.loadingController.create({
    });
    this.presentLoading(loading);
    this.garbageCollection.reduce(this.playerData.objectId, this.coinsGained).then(res => {
      loading.dismiss();
      this.router.navigate(['start']);
      this.coinsGained =0;
      this.numberReplies = 0;
    },err =>{
      loading.dismiss();
    })

  }
  async presentLoading(loading) {
    return await loading.present();
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


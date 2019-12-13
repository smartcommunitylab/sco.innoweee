import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { NavController, ModalController } from '@ionic/angular';
import { ModalCategory } from './modal/modalCategory'
export class ItemGarbage {

  playerId: string = "";
  itemId: string = "";
  itemType: string = "";
  broken: boolean = false;
  switchingOn: boolean = false;
  age: number = 0;
  manual: boolean = false;
  reusable: boolean = false;
  valuable: boolean = false;
  timestamp: any = null;
}
@Component({
  selector: 'app-item-loaded',
  templateUrl: './item-loaded.page.html',
  styleUrls: ['./item-loaded.page.scss'],
})
export class ItemLoadedPage extends MainPage implements OnInit {
  choices: any[] = [];
  categorie: any;
  steps: any;
  questions: any;
  info: any;
  recap: any;
  actualStep: number = 0;
  playerData: any;
  items: string[];
  garbageMap: any;
  item: ItemGarbage = new ItemGarbage();
  garbageCollectionName: string;
  title: { 0: string; 1: string; 2: string; 3: string; 4: string };

  dataReturned: any;
  constructor(private route: ActivatedRoute,
    public translate: TranslateService,
    public authService: AuthenticationService,
    public storage: Storage,
    private profileService: ProfileService,
    private router: Router,
    public navCtrl: NavController,
    public modalController: ModalController,
    private garbageCollection: GarbageCollectionService) {
    super(translate, authService, storage, navCtrl)
  }

  ngOnInit() {
    super.ngOnInit();
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      this.item["itemId"] = this.route.snapshot.paramMap.get("idItem")
      this.item["manual"] = JSON.parse(this.route.snapshot.paramMap.get("manual"));
    }
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
        this.items = res.items
        this.garbageCollectionName = res.nameGE;
        this.garbageCollection.getGargabeMap(this.playerData.tenantId).then(res => {
          this.garbageMap = res;
          this.fillSteps();
        });
      });
    });



  }
  otherIsVisible() {
    if (this.garbageCollectionName && this.garbageCollectionName.toLowerCase()=="r6")
    {
      return true;
    }
    return false;
  }
  otherCategory() {
    this.openModal()
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ModalCategory,
      // backdropDismiss:false,
      cssClass: 'modal-category',
      componentProps: {
        // "paramID": 123,
        // "paramTitle": "Test Title"
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== null) {
        // this.dataReturned = dataReturned.data;
        //alert('Modal Sent Data :'+ dataReturned);
        // console.log(dataReturned)
        if (dataReturned.data["itemType"])
          this.chooseCategory(dataReturned.data["itemType"]);
        if (dataReturned.data["timestamp"])
          this.item.timestamp = dataReturned.data["timestamp"]
      }
    });

    return await modal.present();
  }
  firstStep(): boolean {
    return (this.actualStep == 0)

  }
  ionViewDidEnter() {
    super.ionViewDidEnter();
  }
  chooseCategory(item) {
    this.choices.push(item);
    this.actualStep++;
  }
  getRecap(index) {
    return this.translate.instant(this.recap[index]);
  }
  getLabel(item) {
    if (this.actualStep >= 1) {
      return this.translate.instant(this.steps[this.actualStep][item].label);
    }
    else return this.steps[this.actualStep][item].label[this.translate.currentLang]
  }
  getChoiceLabel(item) {
    if (item[this.translate.currentLang])
      return item[this.translate.currentLang];
    else return this.translate.instant(item);
  }

  questionTime() {
    if (this.steps && this.choices.length < 4)
      return true;
    return false
  }
  infoTime() {
    return (this.questionTime() && (this.actualStep>0));
  }
  getTitle() {
    if (this.title) {
      return this.translate.instant(this.title[this.actualStep]);
    }
    return ""
  }


  sendItem() {
    //check values
    this.item.playerId = this.playerData.objectId;
    this.item.itemType = this.choices[0].value;
    this.item.switchingOn = this.choices[1].value;
    this.item.broken = this.choices[2].value;
    this.item.age = this.choices[3].value;
    this.garbageCollection.itemDelivery(this.item).then(res => {
      //go to item classification
      this.item.reusable = res.reusable;
      this.item.valuable = res.valuable
      this.router.navigate(['item-classification',JSON.stringify(this.item) ] );

      console.log("mandato");
    });
  }
  getQuestion() {
    return this.translate.instant(this.questions[this.actualStep]);
  }
  getInfo() {
    return this.translate.instant(this.info[this.actualStep]);

  }
  fillSteps() {
    this.recap = {
      0: "recap_type",
      1: "recap_on_off",
      2: "recap_broken",
      3: "recap_year"
    }
    this.title = {
      0: "title_type",
      1: "title_on_off",
      2: "title_broken",
      3: "title_year",
      4: "title_end"
    }
    this.questions = {
      0: "question_type",
      1: "question_on_off",
      2: "question_broken",
      3: "question_year"
    }
    this.info = {
      1: "info_on_off",
      2: "info_broken",
      3: "info_year"
    }
    this.steps = {
      0: [],
      1: [{
        "label": "reply_on_question",
        "value": true
      }, {
        "label": "reply_off_question",
        "value": false
      }],
      2: [ {
        "label": "reply_broken_question",
        "value": true
      },{
        "label": "reply_working_question",
        "value": false
      }],
      3: [{
        "label": "reply_yes_question",
        "value": 1
      },{
        "label": "reply_no_question",
        "value": 0
      } 
      // , {
      //   "label": "reply_2_question",
      //   "value": 2
      // }, {
      //   "label": "reply_3_question",
      //   "value": 3
      // }
    ]
    }
    this.items.forEach(element => {
      this.steps[0].push({
        "label": {
          "it": this.garbageMap.items[element].name.it,
          "en": this.garbageMap.items[element].name.en
        },
        "value": element
      })
    });
  }


  getImgName() {
    if (this.garbageCollectionName) {
      return './assets/images/collection/' + this.garbageCollectionName.toLowerCase() + ".png";
    }
    else
      return ""
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
  lastStep() {
    return (this.actualStep == 4)
  }
  cancel() {
    this.router.navigate(['start']);

  }

}

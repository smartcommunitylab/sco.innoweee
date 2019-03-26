import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { ProfileService } from 'src/app/services/profile.service';

export class ItemGarbage {

  playerId: string;
  itemId: string;
  itemType: string;
  broken: boolean;
  switchingOn: boolean;
  age: number;
  manual: boolean;
  reusable: boolean;
  valuable: boolean;

}
@Component({
  selector: 'app-item-loaded',
  templateUrl: './item-loaded.page.html',
  styleUrls: ['./item-loaded.page.scss'],
})
export class ItemLoadedPage implements OnInit {
  choices: any[] = [];
  categorie: any;
  steps: any;
  questions: any;
  recap: any;
  actualStep: number = 0;
  playerData: any;
  items: string[];
  garbageMap: any;
  item: ItemGarbage = new ItemGarbage();
  garbageCollectionName: string;
  constructor(private route: ActivatedRoute,
    private translate: TranslateService,
    private profileService: ProfileService,
    private router: Router,
    private garbageCollection: GarbageCollectionService) { }

  ngOnInit() {
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
      this.router.navigate(['item-classification'], { queryParams: { item: JSON.stringify(this.item) } });

      console.log("mandato");
    });
  }
  getQuestion() {
    return this.translate.instant(this.questions[this.actualStep]);
  }
  fillSteps() {
    this.recap = {
      0: "recap_type",
      1: "recap_on_off",
      2: "recap_broken",
      3: "recap_year"
    }
    this.questions = {
      0: "question_type",
      1: "question_on_off",
      2: "question_broken",
      3: "question_year"
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
      2: [{
        "label": "reply_working_question",
        "value": false
      }, {
        "label": "reply_broken_question",
        "value": true
      }],
      3: [{
        "label": "reply_0_question",
        "value": 0
      }, {
        "label": "reply_1_question",
        "value": 1
      }, {
        "label": "reply_2_question",
        "value": 2
      }, {
        "label": "reply_3_question",
        "value": 3
      }]
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
    return './assets/images/collection/' + this.garbageCollectionName + ".png";
  }
  getFooter() {
    return (this.translate.instant('footer_game_title')+" | "+this.getSchoolName()+" | "+this.getClassName())
  }
  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
  lastStep() {
    return (this.actualStep==4)
  }
  cancel() {
    this.router.navigate(['start']);

  }

}

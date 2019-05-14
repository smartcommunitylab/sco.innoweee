import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { TranslateService } from '@ngx-translate/core';
import { ItemGarbage } from '../item-loaded.page';

@Component({
  selector: 'modalCategory',
  templateUrl: './modalCategory.html',
  styleUrls: ['./modalCategory.scss'],
})
export class ModalCategory implements OnInit {

  modalTitle: string;
  modelId: number;
  playerData: any;
  collections: any;
  firstStep: boolean;
  items: any = [];
  item: any = {};
  garbageMap: any;
  collection: any;
  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
    private profileService: ProfileService,
    private garbageCollection: GarbageCollectionService,
    public translate: TranslateService,

  ) { }

  ngOnInit() {
    this.firstStep = true;
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramTitle;
    this.modalTitle = this.navParams.data.paramID;
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollection.getCollections(this.playerData.gameId).then(res => {
        console.log(res)
        this.collections = res;
        this.garbageCollection.getGargabeMap(this.playerData.tenantId).then(res => {
          this.garbageMap = res;
        });
      })
    })
  }

  async closeModal() {
    // const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss(this.item);
  }
  getImgName(garbageCollection) {
    if (garbageCollection.nameGE) {
      return './assets/images/collection/' + garbageCollection.nameGE.toLowerCase() + ".png";
    }
    else
      return ""
  }
  getCollectionTitle(garbageCollection) {
    if (garbageCollection.message) {
      return garbageCollection.message[this.translate.currentLang]
    }
    else
      return ""
  }
  getStringItem(item) {
    return this.garbageMap.items[item].name[this.translate.currentLang];
  }
  chooseOther() {
    this.item.itemType = {
      "label": {
        "it": "Oggetto generico",
        "en": "Generic item"
      },
      "value": "Generic item"
    }; "Cellphone";
    this.closeModal();
  }
  chooseItem(item) {

    this.item.itemType = {
      "label": {
        "it": this.garbageMap.items[item].name.it,
        "en": this.garbageMap.items[item].name.en
      },
      "value": item
    };
    this.item.timestamp = this.collection.from + 1000 * 60 * 60
    this.closeModal();
  }
  chooseCategory(collection) {
    this.firstStep = false;
    this.collection = collection;
    this.items = collection.items;

  }
  chooseBack() {
    this.firstStep = true;
  }
}
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';

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
    private dataServerService:  DataServerService,
    public translate: TranslateService,
    private auth: AuthService

  ) { }

  async ngOnInit() {
    this.firstStep = true;
    console.table(this.navParams);
    this.modelId = this.navParams.data.paramTitle;
    this.modalTitle = this.navParams.data.paramID;
    const token = await this.auth.getValidToken();

    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.dataServerService.getCollections(this.playerData.gameId, token.accessToken).then(res => {
        this.collections = this.orderCollection(res);

        this.dataServerService.getGargabeMap(this.playerData.tenantId, token.accessToken).then(res => {
          this.garbageMap = res;
        });
      })
    })
  }

  isVisible(collection) {
    if (collection && collection["nameGE"] &&  collection["nameGE"].toLowerCase() !="r6")
    {
      return true;
    }
    return false;
  }
  orderCollection(res: any): any {
    return res.sort((obj1, obj2) => {
      if (obj1.from > obj2.from) {
          return 1;
      }
  
      if (obj1.from < obj2.from) {
          return -1;
      }
  
      return 0;
  });
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
    console.log(JSON.stringify(garbageCollection));
    if (garbageCollection.message && this.translate.defaultLang) {
      return garbageCollection.message[this.translate.defaultLang]
    }
    else
      return ""
  }
  getStringItem(item) {
    // console.log(JSON.stringify(this.garbageMap));
    if (this.garbageMap.items[item] && this.translate.defaultLang && this.garbageMap.items[item].name)
    return this.garbageMap.items[item].name[this.translate.defaultLang];
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
    this.item.timestamp = this.collection.from + (3000 * 60 * 60)
    this.closeModal();
  }
  chooseCategory(collection) {
    this.firstStep = false;
    this.collection = collection;
    this.items = collection.items;

  }
  chooseBack() {
    if (!this.firstStep)
    this.firstStep = true;
    else {this.closeModal();}
  }
}
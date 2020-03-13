import { Component, OnInit } from '@angular/core';
import { ItemClassification } from 'src/app/class/item-classification';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { NavController } from '@ionic/angular';
import { MainPage } from 'src/app/class/MainPage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-item-confirm',
  templateUrl: './item-confirm.page.html',
  styleUrls: ['./item-confirm.page.scss'],
})
export class ItemConfirmPage  extends MainPage implements OnInit {
  private itemClassification: ItemClassification;
  recap: any = {};
  item: any;
  playerData: any;
  garbageCollectionName: any;
  garbageMap: any;
  items: any;
  types: any =[];

  constructor(private route: ActivatedRoute,
    private profileService: ProfileService,
    public navCtrl: NavController, 
    private router: Router,
    public translate: TranslateService, 
    public authService: AuthenticationService, 
    private garbageCollectionService: GarbageCollectionService,
    private utils: UtilsService,
    public storage: Storage) {
    super(translate, authService, storage,navCtrl);
    }
  

  ngOnInit() {
    // get item from param
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      this.item = JSON.parse(this.route.snapshot.paramMap.get("item"))
    } this.translate.get('classification_new').subscribe(async (res: string) => {
      this.recap["new"] = res;
      this.recap["old"] = this.translate.instant("classification_old");
      this.recap["broken"] = this.translate.instant("classification_broken");
      this.recap["fixed"] = this.translate.instant("classification_fixed");
      this.recap["on"] = this.translate.instant("classification_on");
      this.recap["off"] = this.translate.instant("classification_off");
    }
    )
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollectionService.getActualCollection(this.playerData.gameId).then(res => {
        if (res) {
          this.items = res.items
          this.garbageCollectionName = res.nameGE;
        }
        this.garbageCollectionService.getGargabeMap(this.playerData.tenantId).then(res => {
          this.garbageMap = res;
          this.fillSteps();
        });
      });
    });
  }
  fillSteps() {
    this.items.forEach(element => {
      this.types.push({
        "label": {
          "it": this.garbageMap.items[element].name.it,
          "en": this.garbageMap.items[element].name.en
        },
        "value": element
      })
    });
  }

  getAge() {

    if (this.item.age == 0)
      return this.recap["new"];
    if (this.item.age == 1)

      return this.recap["old"];
    return ""
  }
  getId() {
    if (this.item)
      return this.item.itemId
    return ""

  }
  getBroken() {
    if (this.item) {
      if (this.item.broken == true)
        return this.recap["broken"];
      if (this.item.broken == false)
        return this.recap["fixed"];
    }
    return ""
  }
  getType() {
    if (this.item && this.item.itemType) {
      try {
        return this.types.filter(x => this.item.itemType == x.value)[0].label[this.translate.currentLang];
      }
      catch (err) {
        return ""
      }
    }
    return ""
  }
  getSwitching() {
    if (this.item) {
      if (this.item.switchingOn == true)
        return this.recap["on"];
      if (this.item.switchingOn == false)
        return this.recap["off"];
      return ""
    }
  }
  confirm() {
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.garbageCollectionService.confirmItem(this.item.itemId, this.playerData.objectId).then(res => {
        //show alert confirmed and go out
        console.log('confermato');
        this.item.reusable = res.reusable;
        this.item.valuable = res.valuable
        this.router.navigate(['item-classification', JSON.stringify(this.item)]);
      }, err => {
        this.utils.handleError(err);
      })
    })
  }
  getImgName() {
    if (this.garbageCollectionName) {
      return './assets/images/collection/' + this.garbageCollectionName.toLowerCase() + ".png";
    }
    else
      return ""
  }
  cancel() {
    this.navCtrl.navigateRoot('/home')
  }
}

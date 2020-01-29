import { Component, OnInit } from '@angular/core';
import { ItemClassification } from 'src/app/class/item-classification';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { ProfileService } from 'src/app/services/profile.service';
import { NavController } from '@ionic/angular';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-item-confirm',
  templateUrl: './item-confirm.page.html',
  styleUrls: ['./item-confirm.page.scss'],
})
export class ItemConfirmPage implements OnInit {
  private itemClassification: ItemClassification;
  recap: any = {};
  item: any;
  playerData: any;
  garbageCollectionName: any;

  constructor(
    private translate: TranslateService,
    private garbageCollectionService: GarbageCollectionService,
    private profileService:ProfileService,
    private navCtrl: NavController,
    private router: Router,
    private utils:UtilsService,
    private garbageCollection: GarbageCollectionService,
    private route: ActivatedRoute) { }

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
        this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
          this.garbageCollectionName = res.nameGE;
        });
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
    if (this.item)
      return this.item.itemType
    return ""
  }
  getSwitching() {
    if (this.item) {
      if (this.item.switchingOn == true)
        return this.recap["on"];
      if (this.item.switchingOn== false)
        return this.recap["off"];
      return ""
    }
  }
  confirm() {
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
    this.garbageCollectionService.confirmItem(this.item.itemId,this.playerData.objectId).then(res => {
      //show alert confirmed and go out
      console.log('confermato');
      this.item.reusable = res.reusable;
      this.item.valuable = res.valuable
      this.router.navigate(['item-classification',JSON.stringify(this.item) ] );
    },err => {
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

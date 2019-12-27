import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-classification-type',
  templateUrl: './classification-type.page.html',
  styleUrls: ['./classification-type.page.scss'],
})
export class ClassificationTypePage extends CommonPage implements OnInit {
  items: string[];
  answer: any;
  playerData: any;
  garbageMap: any;
  garbageCollectionName: any;

  constructor(public router: Router,
    public translate: TranslateService,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public dataServerService: DataServerService,
    public location:Location,
    public profileService: ProfileService,
    public authService: AuthenticationService) {
      super( router,translate, toastController,route,dataServerService,location,profileService,authService)
     }
    

  ngOnInit() {
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.authService.getValidAACtoken().then( token => {

      this.dataServerService.getActualCollection(this.playerData.gameId,token).then(res => {
        this.items = res.items
        this.garbageCollectionName = res.nameGE;
        this.dataServerService.getGargabeMap(this.playerData.tenantId,token).then(res => {
          this.garbageMap = res;
           this.fillSteps();
        });
      });
      });
    });

  }
  fillSteps() {
    this.items.forEach(element => {
      this.answer.push({
        "label": {
          "it": this.garbageMap.items[element].name.it,
          "en": this.garbageMap.items[element].name.en
        },
        "value": element
      })
    });  }
    chooseCategory(item){
      this.router.navigate(['classification-working']);
    }
  // sayYes() {
  //   this.router.navigate(['classification-working']);

  // }
  // sayNo() {
  //   this.router.navigate(['classification-working']);

  // }

}

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GarbageCollectionService } from 'src/app/services/garbage-collection.service';
import { Router } from '@angular/router';
import { CatalogService } from 'src/app/services/catalog.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-recycle-results',
  templateUrl: './recycle-results.page.html',
  styleUrls: ['./recycle-results.page.scss'],
})
export class RecycleResultsPage implements OnInit {
  playerData: any;
  nameGE: any;
  profileState: any;

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
  }
  ngOnInit() {
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
        this.garbageCollection.getActualCollection(this.playerData.gameId).then(res => {
          this.nameGE = res.nameGE
          this.profileService.getPlayerState(this.playerData.gameId, this.playerData.objectId,this.nameGE).then(res => {
            this.profileState=res;
            console.log(res);
          });
        });
      });

  }
  getResourceLabel(label) {
    return 'resource_' + label;
  }
  getResourceValue(label) {
    if (this.profileState)
      return this.profileState[label];
    else return ""
  }

  getResourceBar(resource) {
    return '0.7';
  }
}

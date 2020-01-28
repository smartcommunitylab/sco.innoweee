import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonPage } from 'src/app/class/common-page';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage extends CommonPage implements OnInit {
  private stat:string='';
  totalItems: any;
  confirmedItems: any;
  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private dataService:DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    private auth: AuthService,
    public authService: AuthenticationService) {
    super(router, translate, toastController, route, dataServerService, location, profileService, authService)
   }

  async ngOnInit() {
    const token = await this.auth.getValidToken();
    const userId = this.profileService.getPlayerData()["objectId"] 
    this.dataService.getStat(userId,token.accessToken).then(res => {
      var totalItemsNumber = res.totalItems;
      // var numeroraccolta=this.actualCollection.nameGE
    this.translate.get('label_item_collected', { totalItems: totalItemsNumber }).subscribe((s: string) => {
      this.totalItems= s;
    });
      // this.confirmedItems = res.confirmedItems;
    })

  }
  endCollection() {
    this.router.navigate(['home']);
  }
  getStat() {
    return this.stat;
  }
}

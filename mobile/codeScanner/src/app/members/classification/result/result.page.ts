import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {
  private stat:string='';
  totalItems: any;
  confirmedItems: any;
  constructor(private router:Router,
    private auth:AuthService,
    private translate:TranslateService,
    private playerDataService: ProfileService,
    private dataService: DataServerService) { }

  async ngOnInit() {
    const token = await this.auth.getValidToken();
    const userId = this.playerDataService.getPlayerData()["objectId"] 
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

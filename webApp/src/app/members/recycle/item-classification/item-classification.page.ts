import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.page.html',
  styleUrls: ['./item-classification.page.scss'],
})
export class ItemClassificationPage implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute,
    private profileService:ProfileService,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.item = JSON.parse(params.item);
        console.log(this.item); // popular
      });
  }
  getValueString():string {
    if (this.item.valuable) {

      return this.translateService.instant("label_recycle_string_value");

    }
    if (this.item.reusable) {
      return  this.translateService.instant("label_recycle_string_reuse");
    }
    return  this.translateService.instant("label_recycle_string_recycle");

  
  }
  getValueItem():string {
    if (this.item.valuable) {

      return this.translateService.instant("label_recycle_value");

    }
    if (this.item.reusable) {
      return  this.translateService.instant("label_recycle_reuse");
    }
    return  this.translateService.instant("label_recycle_recycle");

  }
  getPoints():string {
    if (this.item.reusable)
      return  this.translateService.instant("label_point_reusable");
    return  this.translateService.instant("label_point_recicle");
  }

  getFooter() {
    return (this.translateService.instant('footer_game_title')+" | "+this.getSchoolName()+" | "+this.getClassName())
  }
  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

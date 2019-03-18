import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.page.html',
  styleUrls: ['./item-classification.page.scss'],
})
export class ItemClassificationPage implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute,
    private translateService: TranslateService) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.item = JSON.parse(params.item);
        console.log(this.item); // popular
      });
  }
  getValueItem():string {
    if (this.item.valuable) {

      return this.translateService.instant("label_recycle_value");

    }
    if (this.item.reusable) {
      return  this.translateService.instant("label_recycle_reuse");
    }
    return  this.translateService.instant("label_recycle_recycle");
    // {{'label_item_reusable'|translate}} {{item.reusable}}
    // {{'label_item_valuable'|translate}}{{item.valuable}}
  }
  getPoints():string {
    if (this.item.reusable)
      return  this.translateService.instant("label_point_reusable");
    return  this.translateService.instant("label_point_recicle");
  }

}

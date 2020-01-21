import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-classified',
  templateUrl: './item-classified.page.html',
  styleUrls: ['./item-classified.page.scss'],
})
export class ItemClassifiedPage implements OnInit {
  item: any;

  constructor(private translate: TranslateService,
    private route:ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      this.item= JSON.parse(this.route.snapshot.paramMap.get("item"))
    }

  }
  // getColorMarker(){
  //   if (this.item && this.item.valuable) {
  //     return "marker-green"
  //   }
  //   if (this.item && this.item.reusable) {
  //     return "marker-blue"
  //   }
  //   return "marker-yellow"
  // }
  getBinString() {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_bin_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_bin_recycle_string_reuse");
    }
    return this.translate.instant("label_bin_recycle_string_recycle");
  }
  // getMarkerString() {
  //   if (this.item && this.item.valuable) {
  //     return this.translate.instant("label_marker_recycle_string_value");

  //   }
  //   if (this.item && this.item.reusable) {
  //     return this.translate.instant("label_marker_recycle_string_reuse");
  //   }
  //   return this.translate.instant("label_marker_recycle_string_recycle");
  // }
  getValueString(): string {
    if (this.item && this.item.valuable) {

      return this.translate.instant("label_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");


  }
  getValueItem(): string {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_recycle_value");
    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_reuse");
    }
    return this.translate.instant("label_recycle_recycle");

  }
  getPoints(): string {
    if (this.item && this.item.reusable)
      return this.translate.instant("label_point_reusable");
    return this.translate.instant("label_point_recicle");
  }
}

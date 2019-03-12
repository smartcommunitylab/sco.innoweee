import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.page.html',
  styleUrls: ['./item-classification.page.scss'],
})
export class ItemClassificationPage implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.item = JSON.parse(params.item);
        console.log(this.item); // popular
      });
  }

}

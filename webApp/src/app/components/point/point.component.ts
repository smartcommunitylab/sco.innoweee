import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss']
})
export class PointComponent implements OnInit {
  @Input('pointvalue') pointValue;
  @Input('srcicon') srcicon;
  @Input('label') label;
  constructor() { 

  }

  ngOnInit() {
    // console.log(this.label);
    // console.log(this.pointValue);
    // console.log(this.iconName);
  }

}

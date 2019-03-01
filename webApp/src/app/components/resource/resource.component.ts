import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-resource',
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
  @Input('resourcename') pointValue;
  @Input('barvalue') barValue;
  @Input('resourcevalue') resourceValue;
  constructor() { }

  ngOnInit() {
  }

  getResourceUnit(value) {

    if (value > 1000)
      return "Kg"
    if (value < 1000 && value > 1)
      return "g"
    return "mg"
  }
  getResourceValue(value) {

    if (value > 1000)
      return value/1000;
    if (value < 1000 && value > 0)
      return value
    return value*1000

  }

}

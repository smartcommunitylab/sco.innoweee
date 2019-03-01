import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrls: ['./comparison.component.scss']
})
export class ComparisonComponent implements OnInit {
  @Input('resourcename') pointValue;
  @Input('barvalue') barValue;
  @Input('className') className;
  @Input('resourcevalue') resourceValue;
  @Input('barCompareValue') barCompareValue;
  @Input('resourceCompareValue') resourceCompareValue;
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

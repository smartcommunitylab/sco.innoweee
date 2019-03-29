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
    if (value > 1)
      return "Kg"
    if (value < 1 && value > 0.001)
      return "g"
    return "mg"
  }
  getResourceValue(value) {
    if (value > 1)
      return value
    if (value < 1 && value > 0.001)
      return value*1000;
    return value*1000000;

  }
  getClass(value) {
    if ( value > 1)
      return 'kilo'
    if (value < 1 && value > 0.001)
      return 'grammo'
    return 'miligrammo'
  }
}

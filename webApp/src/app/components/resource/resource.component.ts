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

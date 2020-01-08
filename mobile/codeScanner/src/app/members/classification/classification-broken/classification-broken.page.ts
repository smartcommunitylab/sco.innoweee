import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classification-broken',
  templateUrl: './classification-broken.page.html',
  styleUrls: ['./classification-broken.page.scss'],
})
export class ClassificationBrokenPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  sayYes() {
    this.router.navigate(['classification-age']);

  }
  sayNo() {
    this.router.navigate(['classification-age']);

  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classification-working',
  templateUrl: './classification-working.page.html',
  styleUrls: ['./classification-working.page.scss'],
})
export class ClassificationWorkingPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  sayYes() {
    this.router.navigate(['classification-broken']);

  }
  sayNo() {
    this.router.navigate(['classification-broken']);

  }

}

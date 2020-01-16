import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-classification-age',
  templateUrl: './classification-age.page.html',
  styleUrls: ['./classification-age.page.scss'],
})
export class ClassificationAgePage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  sayYes() {
    this.router.navigate(['recap']);

  }
  sayNo() {
    this.router.navigate(['recap']);
  }
}

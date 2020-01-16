import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recap',
  templateUrl: './recap.page.html',
  styleUrls: ['./recap.page.scss'],
})
export class RecapPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }
  end() {
    this.router.navigate(['result']);
  }
  newItem(){
    this.router.navigate(['home']);
  }
}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private authService: AuthenticationService) { }
 
  ngOnInit() {
  }
 
  login(form){
    this.authService.login(form.value)
    // .subscribe((res)=>{
    //   // this.router.navigateByUrl('home');
    // });
  }
  // login() {
  //   this.authService.login();
  // }

}

import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';
 
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  image1: String= '../assets/images/recycle.png';
  image2: String= '../assets/images/robot.png';
  image3: String= '../assets/images/edu.png';
  image4: String= '../assets/images/team.png';
  constructor(private authService: AuthenticationService) { }
 
  ngOnInit() {
  }
 

}
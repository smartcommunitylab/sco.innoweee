import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private profileService: ProfileService,
    private router: Router
  ) { }

  ngOnInit() {
  }


  chooseProfile(profile:string){
    this.profileService.setProfileRole(profile);
      this.router.navigate(['login']);

  }

}

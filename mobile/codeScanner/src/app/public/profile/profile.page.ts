import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  playerName: any;

  constructor(
    private profileService: ProfileService,
    private auth:AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    //if profile already check, login
    var playerId = this.profileService.getMemorizedPlayerId();
    var playerData = this.profileService.getMemorizedPlayerData();
    var playerName = this.profileService.getMemorizedPlayerName();
    var schoolName = this.profileService.getMemorizedSchool();
    if (localStorage.getItem('profile') && playerId && playerData && playerName && schoolName){
      this.profileService.setPlayerData(playerData);
      // this.profileService.setPlayerState(this.playerState);
      this.profileService.setPlayerName(playerName);
      this.profileService.setSchoolName(schoolName);
      this.router.navigate(['home'], { queryParams: { playerId: playerId, playerName: playerName, playerData: JSON.stringify(playerData) } });
    }
  }
  playerData(playerData: any): any {
    throw new Error("Method not implemented.");
  }


  chooseProfile(profile:string){
    this.profileService.setProfileRole(profile);
      this.router.navigate(['login']);

  }

}

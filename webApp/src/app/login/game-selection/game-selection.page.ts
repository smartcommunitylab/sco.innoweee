import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.page.html',
  styleUrls: ['./game-selection.page.scss'],
})
export class GameSelectionPage implements OnInit {

  constructor(private profileService: ProfileService,
     private router: Router,private fb: FormBuilder,
     private _cdr: ChangeDetectorRef,) { 

  }
  domain: string = "";
  domains: [];
  instituteId: string = "";
  institutes: [];
  schoolId: string = "";
  schools: [];
  gameId: string = "";
  games: [];
  playerId: string = "";
  players: [];
  playerData: {};

  ngOnInit() {
    this.getDomain()
  }
  enter() {
    this.router.navigate(['/home']);
  }
  getDomain() {
    this.profileService.getDomain().then(res => {
      console.log(res);
      this.domains = res.tenants;
      if (res.tenants.length == 1) {
        this.domain = res.tenants[0]
       // this.form.get('domainForm').setValue(this.domain);
        this._cdr.detectChanges();

        // this.getInstitute(this.domain);
      }
    }
    )
  }

  getInstitute(domainId:string) {
    this.domain =domainId;
    this.profileService.getInstitute(this.domain).then(res => {
      console.log(res);
      this.institutes = res;
      if (res.length == 1) {
        this.instituteId = res[0].objectId;
        this._cdr.detectChanges();

        // this.getSchool();
      }
    });
  }
  getSchool(instituteId) {
    this.instituteId=instituteId;
    this.profileService.getSchool(this.domain, this.instituteId).then(res => {
      console.log(res);
      this.schools = res;
      if (res.length == 1) {
        this.schoolId = res[0].objectId;
        this._cdr.detectChanges();

        // this.getGame();
      }
    });
  }

  getGame(schoolId) {
    this.schoolId=schoolId;
    this.profileService.getGame(this.domain, this.instituteId, this.schoolId).then(res => {
      console.log(res);
      this.games = res;
      if (res.length == 1) {
        this.gameId = res[0].objectId;
        this._cdr.detectChanges();

        // this.getPlayer()
      }
    });
  }
  getPlayer(gameId) {
    this.gameId=gameId;
    this.profileService.getPlayer(this.gameId).then(res => {
      console.log(res);
      this.players = res[0].objectId;
      if (res.length == 1) {
        this.playerId = res[0].objectId;
        this._cdr.detectChanges();

        // this.getPlayerData()
      }
    });
  }
  
  getPlayerData() {
    this.playerData = this.profileService.getPlayerData(this.playerId, this.players);
    //vola a home
    this.router.navigate(['/home']);
  }

}

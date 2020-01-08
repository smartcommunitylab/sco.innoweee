import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-manual-insert',
  templateUrl: './manual-insert.page.html',
  styleUrls: ['./manual-insert.page.scss'],
})
export class ManualInsertPage implements OnInit {
  scanData: any = null;
  playerId: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private profileService: ProfileService
    ) { }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.playerId = params.playerId;
    })
  }
  insertCode() {
    this.router.navigate(['item-recognized'], { queryParams: { scanData: JSON.stringify(this.scanData), playerId: this.playerId } })  }
    getFooter() {
      return (this.getSchoolName())
    }
  
    getSchoolName() {
      return this.profileService.getSchoolName();
    }
  }

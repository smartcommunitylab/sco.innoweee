import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { ProfileService } from 'src/app/services/profile.service';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage extends CommonPage implements OnInit  {

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private alertController: AlertController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  ngOnInit() {
  }

  getFooter() {
  //  return (this.getSchoolName())
  }


}

import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { DataServerService } from '../services/data.service';
import { ProfileService } from '../services/profile.service';
import { AuthenticationService } from '../services/authentication.service';
import {Location} from '@angular/common';

export class CommonPage implements OnInit {
    category: any;
    mypos: { lat: number, long: number };
  
    constructor(
        public router: Router,
        public translate: TranslateService,
        public toastController: ToastController,
        public route: ActivatedRoute,
        public dataServerService: DataServerService,
        public location:Location,
        public profileService: ProfileService,
        public authService: AuthenticationService) {
    }
  
    ngOnInit() {

    }
    changeClass() {
        this.router.navigate(['select-class']);
      }
}

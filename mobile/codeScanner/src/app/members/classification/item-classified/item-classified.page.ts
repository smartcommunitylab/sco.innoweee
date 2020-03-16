import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { ClassificationService } from 'src/app/services/classification.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CommonPage } from 'src/app/class/common-page';
import { Location } from '@angular/common';

@Component({
  selector: 'app-item-classified',
  templateUrl: './item-classified.page.html',
  styleUrls: ['./item-classified.page.scss'],
})
export class ItemClassifiedPage extends CommonPage implements OnInit {
  item: any;

  constructor( public translate: TranslateService,
    public router: Router,
    private alertController: AlertController,
    public toastController: ToastController,
    public route: ActivatedRoute,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    public profileService: ProfileService,
    private classificationService: ClassificationService,
    public authService: AuthenticationService) {
    super(auth,router, translate, toastController, route, dataServerService, location, profileService, authService)
   }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      this.item= JSON.parse(this.route.snapshot.paramMap.get("item"))
    }

  }
  getColorMarker(){
    if (this.item && this.item.valuable) {
      return "marker-green"
    }
    if (this.item && this.item.reusable) {
      return "marker-blue"
    }
    return "marker-yellow"
  }
  
textColor(color) {
    if (this.isDarkColor(color)) return '#fff';
    return '#000';
};
isDarkColor (color) {
    if (!color) return true;
    var c = color.substring(1); // strip #
    var rgb = parseInt(c, 16); // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff; // extract red
    var g = (rgb >> 8) & 0xff; // extract green
    var b = (rgb >> 0) & 0xff; // extract blue

    var luma = (r + g + b) / 3; //0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

    return luma < 128;
};
  // getColorMarker(){
  //   if (this.item && this.item.valuable) {
  //     return "marker-green"
  //   }
  //   if (this.item && this.item.reusable) {
  //     return "marker-blue"
  //   }
  //   return "marker-yellow"
  // }
  getBinString() {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_bin_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_bin_recycle_string_reuse");
    }
    return this.translate.instant("label_bin_recycle_string_recycle");
  }
  // getMarkerString() {
  //   if (this.item && this.item.valuable) {
  //     return this.translate.instant("label_marker_recycle_string_value");

  //   }
  //   if (this.item && this.item.reusable) {
  //     return this.translate.instant("label_marker_recycle_string_reuse");
  //   }
  //   return this.translate.instant("label_marker_recycle_string_recycle");
  // }
  getValueString(): string {
    if (this.item && this.item.valuable) {

      return this.translate.instant("label_recycle_string_value");

    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");


  }
  getValueItem(): string {
    if (this.item && this.item.valuable) {
      return this.translate.instant("label_recycle_value");
    }
    if (this.item && this.item.reusable) {
      return this.translate.instant("label_recycle_reuse");
    }
    return this.translate.instant("label_recycle_recycle");

  }
  getPoints(): string {
    if (this.item && this.item.value) {
      return this.translate.instant("label_point_reusable");
    }
    if (this.item && this.item.reusable)
      return this.translate.instant("label_point_reusable");
    return this.translate.instant("label_point_recicle");
  }

  getFooter() {
    return (this.getClassName()) +' - '+(this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
  getClassName() {
    return this.profileService.getPlayerName();

  }
}

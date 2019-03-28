import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileService } from 'src/app/services/profile.service';
import { MainPage } from 'src/app/class/MainPage';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-item-classification',
  templateUrl: './item-classification.page.html',
  styleUrls: ['./item-classification.page.scss'],
})
export class ItemClassificationPage extends MainPage implements OnInit {
  item: any;

  constructor(private route: ActivatedRoute,
    private profileService: ProfileService,
    public translate: TranslateService, public authService: AuthenticationService, public storage: Storage) {
    super(translate, authService, storage);
  }

  ngOnInit() {
    super.ngOnInit();
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.item = JSON.parse(params.item);
        console.log(this.item); // popular
      });
  }
  getValueString(): string {
    if (this.item.valuable) {

      return this.translate.instant("label_recycle_string_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_recycle_string_reuse");
    }
    return this.translate.instant("label_recycle_string_recycle");


  }
  getValueItem(): string {
    if (this.item.valuable) {

      return this.translate.instant("label_recycle_value");

    }
    if (this.item.reusable) {
      return this.translate.instant("label_recycle_reuse");
    }
    return this.translate.instant("label_recycle_recycle");

  }
  getPoints(): string {
    if (this.item.reusable)
      return this.translate.instant("label_point_reusable");
    return this.translate.instant("label_point_recicle");
  }

  getFooter() {
    return (this.translate.instant('footer_game_title') + " | " + this.getSchoolName() + " | " + this.getClassName())
  }
  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}

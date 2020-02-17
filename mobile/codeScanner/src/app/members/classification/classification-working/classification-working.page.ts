import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClassificationService } from 'src/app/services/classification.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController, ToastController } from '@ionic/angular';
import { ItemClassification } from 'src/app/class/item-classification';
import { CommonPage } from 'src/app/class/common-page';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { async } from 'rxjs/internal/scheduler/async';
import { Location } from '@angular/common';

@Component({
  selector: 'app-classification-working',
  templateUrl: './classification-working.page.html',
  styleUrls: ['./classification-working.page.scss'],
})
export class ClassificationWorkingPage extends CommonPage implements OnInit {
  private itemClassification:ItemClassification;
  recap: any={};

  constructor(
    public translate: TranslateService,
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
    this.itemClassification = this.classificationService.itemClassification;
    this.translate.get('classification_new').subscribe(async (res: string) => {
      this.recap["new"]=res;
      this.recap["old"]=this.translate.instant("classification_old");
      this.recap["broken"]=this.translate.instant("classification_broken");
      this.recap["fixed"]=this.translate.instant("classification_fixed");
      this.recap["on"]=this.translate.instant("classification_on");
      this.recap["off"]=this.translate.instant("classification_off");
    })
  }
  sayYes() {
    this.classificationService.itemClassification.setSwitchingOn(true);

    this.router.navigate(['classification-broken']);

  }
  sayNo() {
    this.classificationService.itemClassification.setSwitchingOn(false);
    this.router.navigate(['classification-broken']);

  }
  async openInfo() {
    this.translate.get('classification_type_working_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('classification_type_working_message');
      const alert = await this.alertController.create({
        header: title,
        message: message,
        buttons: ['OK']
      });
  
      await alert.present();
    })
  }

  getAge() {

    if (this.itemClassification.getAge() == 0)
      return this.recap["new"];
    if (this.itemClassification.getAge() == 1)

      return this.recap["old"];
    return ""
  }  
  getId() {
    if (this.itemClassification)

    return this.itemClassification.getItemId()
    return ""
  
  }
  getBroken() {
    if (this.itemClassification){
    if (this.itemClassification.getBroken() == true)
      return this.recap["broken"];
    if (this.itemClassification.getBroken() == false)
      return this.recap["fixed"];
    }
    return ""
  }
  getType() {
    if (this.itemClassification)

    return this.itemClassification.getItemValue()
    return ""
  }
  getSwitching() {
    if (this.itemClassification)
{
    if (this.itemClassification.getSwitchingOn() == true)
      return this.recap["on"];
    if (this.itemClassification.getSwitchingOn() == false)
      return this.recap["off"];
    return ""}
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

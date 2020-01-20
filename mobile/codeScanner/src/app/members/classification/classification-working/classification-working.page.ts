import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassificationService } from 'src/app/services/classification.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ItemClassification } from 'src/app/class/item-classification';

@Component({
  selector: 'app-classification-working',
  templateUrl: './classification-working.page.html',
  styleUrls: ['./classification-working.page.scss'],
})
export class ClassificationWorkingPage implements OnInit {
  private itemClassification:ItemClassification;
  recap: any={};

  constructor(
    private router: Router,
    public translate: TranslateService,
    private alertController: AlertController,
    private classificationService: ClassificationService) { }

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

    return this.itemClassification.getItemType()
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

}

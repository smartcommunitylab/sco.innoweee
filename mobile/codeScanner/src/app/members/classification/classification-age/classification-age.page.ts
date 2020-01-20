import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClassificationService } from 'src/app/services/classification.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';
import { ItemClassification } from 'src/app/class/item-classification';

@Component({
  selector: 'app-classification-age',
  templateUrl: './classification-age.page.html',
  styleUrls: ['./classification-age.page.scss'],
})
export class ClassificationAgePage implements OnInit {
  private itemClassification: ItemClassification;
  recap: any = {};
  constructor(private router: Router,
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
    this.classificationService.itemClassification.setAge(1);
    this.router.navigate(['recap']);

  }
  sayNo() {
    this.classificationService.itemClassification.setAge(0);
    this.router.navigate(['recap']);
  }
  async openInfo() {
    this.translate.get('classification_type_age_title').subscribe(async (res: string) => {
      var title = res;
      var message = this.translate.instant('classification_type_age_message');
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
    if (this.itemClassification.getBroken() == true)
      return this.recap["broken"];
    if (this.itemClassification.getBroken() == false)
      return this.recap["fixed"];
    return ""
  }
  getType() {
    return this.itemClassification.getItemType()
  }
  getSwitching() {
    if (this.itemClassification.getSwitchingOn() == true)
      return this.recap["on"];
    if (this.itemClassification.getSwitchingOn() == false)
      return this.recap["off"];
    return ""
  }
}

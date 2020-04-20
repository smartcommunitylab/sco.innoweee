import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataServerService } from 'src/app/services/data.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { CommonPage } from 'src/app/class/common-page';
import { ToastController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage extends CommonPage implements OnInit {
  private stat: any;
  // totalItems: any;
  myRole: string;

  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private dataService: DataServerService,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private alertController: AlertController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  async ngOnInit() {
    const token = await this.auth.getValidToken();
    const userId = this.profileService.getPlayerData()["objectId"]
    this.dataService.getStat(userId, token.accessToken).then(res => {
      this.stat = res;
      // var numeroraccolta=this.actualCollection.nameGE
      // this.translate.get('label_item_collected', { totalItems: totalItemsNumber }).subscribe((s: string) => {
      //   this.totalItems= s;
      // });
      // this.confirmedItems = res.confirmedItems;
    })
    this.myRole = this.profileService.getProfileRole();

  }
  endCollection() {
    this.router.navigate(['home']);
  }
  getStat() {
    return this.stat;
  }
  getFooter() {
    return (this.getClassName()) + ' - ' + (this.getSchoolName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }
  getClassName() {
    return this.profileService.getPlayerName();

  }

  async legenda() {
    let variableString = "";
    if (this.isParent()) {
      variableString = "Ricordati di portare gli oggetti in classe per ottenere gli oggetti RICICLO e RIUSO per comprare le parti del robot.<br> Con l'aiuto della tua insegnante conferisci gli oggetti all'interno dello smart bin (bidone intelligente) corretto.   "
    } else {
      variableString = "Ricordati di conferire gli oggetti utilizzando la tessera della tua classe nello smart bin (bidone intelligente) corretto."
    }
    const alert = await this.alertController.create({
      header: "Legenda",
      cssClass: 'stat-popup',
      message: `
      <div class="legenda-label">
      <div class="legenda-label-title">Oggetti classificati:</div>
      <div class="legenda-label-text">
sono gli oggetti che sono stati registrati con la Mobile App WEEE R robots a casa dalla tua classe.      </div>
    </div>
    <div class="legenda-label">
      <div class="legenda-label-title">Oggetti confermati:</div>
      <div class="legenda-label-text">
      sono gli oggetti che sono stati portati a scuola e verificati dall'insegnante della tua classe.
      </div>
    </div>
    <div class="legenda-label">
      <div class="legenda-label-text">
      ${variableString}
 </div>`,
      buttons: [
        {
          text: 'OK',
          cssClass: 'secondary'
        }
      ]
    });

    await alert.present();
  }

  isParent() {
    return this.myRole === this.profileService.getParentValue();
  }
}

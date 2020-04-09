import { Component, OnInit } from '@angular/core';
import { CommonPage } from 'src/app/class/common-page';
import { TranslateService } from '@ngx-translate/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, AlertController, LoadingController, NavController } from '@ionic/angular';
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
export class StatsPage extends CommonPage implements OnInit {
  playerData: any;
  stat: any;
  constructor(public translate: TranslateService,
    public router: Router,
    public toastController: ToastController,
    public profileService: ProfileService,
    public route: ActivatedRoute,
    private navCtrl: NavController,
    public dataServerService: DataServerService,
    public location: Location,
    public auth: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public authService: AuthenticationService) {
    super(auth, router, translate, toastController, route, dataServerService, location, profileService, authService)
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      duration: 2000
    });
    await loading.present();

  }
  async ngOnInit() {
    this.presentLoading();
    const token = await this.auth.getValidToken();
    this.dataServerService.getOperatorStats(this.profileService.getDomainMemorized()["tenants"][0], this.profileService.getCollector(), token.accessToken).then(res => {
      console.log(JSON.stringify(res));
      if (res)
        this.stat = res;
    })
  }
  home() {
    this.navCtrl.navigateRoot('home-operator');
  }
  async legenda() {
    const alert = await this.alertController.create({
      header: "Il significato delle statistiche",
      cssClass: 'stat-popup',
      message: `
      <div class="legenda-label">
      <div class="legenda-label-title">Totale oggetti attesi:</div>
      <div class="legenda-label-text">
      corrisponde al numero di oggetti RICICLO che sono stati classificati dalle famiglie, confermati a scuola e conferiti negli smart bin, ma che devono ancora essere verificati dall’operatore. Il numero <b>diminuisce</b> man mano che gli oggetti attesi vengono verificati e confermati presso lo stabilimento.
      </div>
    </div>
    <div class="legenda-label">
      <div class="legenda-label-title">Totale oggetti corrispondenti:</div>
      <div class="legenda-label-text">
      corrisponde al numero di oggetti RICICLO che sono stati classificati dalle famiglie, confermati a scuola, conferiti negli smart bin, e che sono stati verificati dall’operatore. Il numero <b>aumenta</b> man mano che gli oggetti corrispondenti vengono verificati e confermati.
      </div>
    </div>
    <div class="legenda-label">
      <div class="legenda-label-title">Totale oggetti inattesi:</div>
      <div class="legenda-label-text">
      corrisponde al numero di oggetti che sono stati verificati e confermati dall’operatore presso lo stabilimento, ma che potrebbero non essere oggetti RICICLO, non avere l’etichetta, non essere stati classificati dalle famiglie, non essere stati confermati a scuola o non essere stati conferiti negli smart bin. Il numero aumenta man mano che l’operatore verifica e conferma gli oggetti che presentano le caratteristiche sopra riportate.      </div>
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
  getFooter() {
  }


}

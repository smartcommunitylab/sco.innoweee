import { Component, OnInit } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServerService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage implements OnInit {
  scanData: any = null;
  options: BarcodeScannerOptions;
  playerId: any;
  playerName: any;
  itemPresent: boolean;

  constructor(public navCtrl: NavController,
    private barcodeScanner: BarcodeScanner,
    private dataServerService: DataServerService,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private router: Router) {
  }
  ionViewWillEnter() {
    this.scanData=null;
    this.itemPresent=false;
  }
  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params); // {order: "popular"}
        this.playerId = params.playerId;
        this.playerName = params.playerName;
        console.log(this.playerName); // popular
      });
  }
  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      console.log(barcodeData);
      this.scanData = barcodeData;
      this.checkIfPresent(this.scanData);
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }

  changeClass() {
    this.router.navigate(['members', 'select-class']);
  }
  checkIfPresent(scanData) {
    this.dataServerService.checkIfPresent(scanData.text, this.playerId).then(res => {
      console.log(res);
      if (res.result) {
        //ok
        this.itemPresent = true;
      }
      else {
        //already used
        this.itemPresent = false;
      }


    })
  }

  sendLim() {
    if (!this.itemPresent) {
      this.dataServerService.sendItem(this.scanData.text, this.playerId).then(res => {
        console.log(res);
      })
    } else {
      this.presentToast("ola");
    }




  }

  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000
    })
    toast.present();
  }
}

import { Component } from '@angular/core';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})

export class DashboardPage  {
  scanData: {};
  options: BarcodeScannerOptions;
  constructor(public navCtrl: NavController,  private barcodeScanner: BarcodeScanner) {
  }

  scan() {
    this.options = {
      prompt: "Scan your barcode "
    }
    this.barcodeScanner.scan(this.options).then((barcodeData) => {

      console.log(barcodeData);
      this.scanData = barcodeData;
    }, (err) => {
      console.log("Error occured : " + err);
    });
  }
}

import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NFC, Ndef } from '@ionic-native/nfc/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  message: string = null;

  constructor(private platform: Platform, private nfc: NFC, private ndef: Ndef) {
    platform.ready().then(() => {
      this.nfc.addTagDiscoveredListener(() => {
        console.log('successfully attached listener');
      }, (err) => {
        console.log('error attaching listener', err);
      }).subscribe((event) => {
        console.log('received message. the tag contains: ', event.tag);
        const str = this.nfc.bytesToHexString(event.tag.id);
        this.message = str;
        console.log('decoded tag id', str);
      });
    });
  }
}

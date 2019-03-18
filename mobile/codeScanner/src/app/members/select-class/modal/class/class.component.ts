import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent {

  classes: any;
  myClass:any;

  
  constructor(private modalController: ModalController,
              private navParams: NavParams) {
  }
  ionViewWillEnter() {
    this.classes = this.navParams.get('classes');
  }
  // async myDismiss() {
    
  //   await this.modalController.dismiss(this.myClass);
  // }
  selectClass(myClass) {
     this.modalController.dismiss(myClass);
  }
}

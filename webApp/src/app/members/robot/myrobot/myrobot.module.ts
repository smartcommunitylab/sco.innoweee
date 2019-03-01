import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MyrobotPage } from './myrobot.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';

const routes: Routes = [
  {
    path: '',
    component: MyrobotPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MyrobotPage]
})
export class MyrobotPageModule {}

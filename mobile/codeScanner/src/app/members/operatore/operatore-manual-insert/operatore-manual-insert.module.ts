import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OperatoreManualInsertPage } from './operatore-manual-insert.page';

const routes: Routes = [
  {
    path: '',
    component: OperatoreManualInsertPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperatoreManualInsertPage]
})
export class OperatoreManualInsertPageModule {}

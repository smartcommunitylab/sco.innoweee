import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassificationBrokenPage } from './classification-broken.page';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ClassificationBrokenPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ClassificationBrokenPage]
})
export class ClassificationBrokenPageModule {}

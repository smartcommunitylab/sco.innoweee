import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ClassificationTypePage } from './classification-type.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalCategory } from './modal/modalCategory';

const routes: Routes = [
  {
    path: '',
    component: ClassificationTypePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  entryComponents:[ModalCategory],
  declarations: [ClassificationTypePage,ModalCategory]
})
export class ClassificationTypePageModule {}

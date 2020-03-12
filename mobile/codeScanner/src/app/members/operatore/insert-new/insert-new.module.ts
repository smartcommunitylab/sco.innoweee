import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InsertNewPage } from './insert-new.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { InsertModalCategory } from './modal/insertModalCategory';

const routes: Routes = [
  {
    path: '',
    component: InsertNewPage
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
  entryComponents:[InsertModalCategory],
  declarations: [InsertNewPage,InsertModalCategory]
})
export class InsertNewPageModule {}

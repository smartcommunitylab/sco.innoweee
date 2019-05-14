import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ItemLoadedPage } from './item-loaded.page';
import { TranslateModule } from '@ngx-translate/core';
import { ModalCategory } from './modal/modalCategory';

const routes: Routes = [
  {
    path: '',
    component: ItemLoadedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RouterModule.forChild(routes)
  ],
  entryComponents:[ModalCategory],
  declarations: [ItemLoadedPage,ModalCategory]
})
export class ItemLoadedPageModule {}

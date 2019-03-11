import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RecycleResultsPage } from './recycle-results.page';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared.module';

const routes: Routes = [
  {
    path: '',
    component: RecycleResultsPage
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
  declarations: [RecycleResultsPage]
})
export class RecycleResultsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { GameSelectionPage } from './game-selection.page';

const routes: Routes = [
  {
    path: '',
    component: GameSelectionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GameSelectionPage]
})
export class GameSelectionPageModule {}

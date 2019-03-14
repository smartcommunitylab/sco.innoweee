import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { GameSelectionPage } from './game-selection.page';
import { ClassComponent } from './modals/class/class.component';

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
  entryComponents: [ClassComponent],
  declarations: [GameSelectionPage, ClassComponent]
})
export class GameSelectionPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';
import { SelectClassPage } from './select-class.page';
import { ClassComponent } from './modal/class/class.component';

const routes: Routes = [
  {
    path: '',
    component: SelectClassPage
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
  declarations: [SelectClassPage,ClassComponent],
  entryComponents: [ClassComponent]

})
export class SelectClassPageModule {}

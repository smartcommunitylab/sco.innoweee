import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
 
const routes: Routes = [
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardPageModule' },
  { path: 'select-class', loadChildren: './select-class/select-class.module#SelectClassPageModule' },
  { path: 'item-recognized', loadChildren: './item-recognized/item-recognized.module#ItemRecognizedPageModule' },
  { path: 'result', loadChildren: './classification/result/result.module#ResultPageModule' }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes),CommonModule],
  exports: [RouterModule]
})
export class MemberRoutingModule { }


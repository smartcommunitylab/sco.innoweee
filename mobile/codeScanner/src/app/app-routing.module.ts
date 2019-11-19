import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule'},
  // { path: 'select-class', loadChildren: './members/select-class/select-class.module#SelectClassPageModule' , canActivate: [AuthGuard]},
  // { path: 'dashboard', loadChildren: './members/dashboard/dashboard.module#DashboardPageModule' , canActivate: [AuthGuard]},
  // { path: '**', redirectTo: 'login', pathMatch: 'full'}
  // { path: '', redirectTo: 'select-class', pathMatch: 'full'},
  { path: 'select-class', loadChildren: './members/select-class/select-class.module#SelectClassPageModule' },
  { path: 'dashboard', loadChildren: './members/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'item-recognized', loadChildren: './members/item-recognized/item-recognized.module#ItemRecognizedPageModule' },
  { path: '**', redirectTo: 'select-class', pathMatch: 'full'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

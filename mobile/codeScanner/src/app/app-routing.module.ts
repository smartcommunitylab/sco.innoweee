import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule'},
  { path: 'select-class', loadChildren: './members/select-class/select-class.module#SelectClassPageModule' },
  { path: 'dashboard', loadChildren: './members/dashboard/dashboard.module#DashboardPageModule' },
  { path: 'home', loadChildren: './members/home/home.module#HomePageModule' },
  { path: 'item-recognized', loadChildren: './members/item-recognized/item-recognized.module#ItemRecognizedPageModule' },
  { path: 'classification-broken', loadChildren: './members/classification/classification-broken/classification-broken.module#ClassificationBrokenPageModule' },
  { path: 'classification-type', loadChildren: './members/classification/classification-type/classification-type.module#ClassificationTypePageModule' },
  { path: 'classification-working', loadChildren: './members/classification/classification-working/classification-working.module#ClassificationWorkingPageModule' },
  { path: 'classification-age', loadChildren: './members/classification/classification-age/classification-age.module#ClassificationAgePageModule' },
  { path: 'recap', loadChildren: './members/classification/recap/recap.module#RecapPageModule' },
  { path: 'manual-insert', loadChildren: './members/manual-insert/manual-insert.module#ManualInsertPageModule' },
  { path: '**', redirectTo: 'select-class', pathMatch: 'full'}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

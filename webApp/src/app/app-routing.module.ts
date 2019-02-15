import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { 
    path: 'members', 
    canActivate: [AuthGuard],
    loadChildren: './members/member-routing.module#MemberRoutingModule'
  },
  { path: 'start', loadChildren: './recycle/start/start.module#StartPageModule' },
  { path: 'item-classification', loadChildren: './recycle/item-classification/item-classification.module#ItemClassificationPageModule' },
  { path: 'item-loaded', loadChildren: './item-loaded/item-loaded.module#ItemLoadedPageModule' },
  { path: 'recycle-results', loadChildren: './recycle/recycle-results/recycle-results.module#RecycleResultsPageModule' },
  { path: 'home', loadChildren: '../home/home.module#HomePageModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

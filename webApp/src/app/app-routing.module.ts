import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


// const routes: Routes = [
//   { path: '', redirectTo: 'members', pathMatch: 'full' },
//   { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
//   { 
//     path: 'members', 
//     canActivate: [AuthGuard],
//     loadChildren: './members/member-routing.module#MemberRoutingModule'
//   }
// ];
const routes: Routes = [
  { path: '', redirectTo: 'game-selection', pathMatch: 'full', canActivate: [AuthGuard]},
  { path: 'game-selection', loadChildren: './members/game-selection/game-selection.module#GameSelectionPageModule', canActivate: [AuthGuard] },
  { path: 'start', loadChildren: './members/recycle/start/start.module#StartPageModule' , canActivate: [AuthGuard]},
  { path: 'item-classification', loadChildren: './members/recycle/item-classification/item-classification.module#ItemClassificationPageModule' , canActivate: [AuthGuard]},
  { path: 'item-loaded/:idItem/:manual', loadChildren: './members/recycle/item-loaded/item-loaded.module#ItemLoadedPageModule' , canActivate: [AuthGuard]},
  { path: 'recycle-results', loadChildren: './members/recycle/recycle-results/recycle-results.module#RecycleResultsPageModule' , canActivate: [AuthGuard]},
  { path: 'home', loadChildren: './members/home/home.module#HomePageModule' , canActivate: [AuthGuard]},
  { path: 'material', loadChildren: './members/education/material/material.module#MaterialPageModule' , canActivate: [AuthGuard]},
  { path: 'allteam', loadChildren: './members/team/allteam/allteam.module#AllteamPageModule' , canActivate: [AuthGuard]},
  { path: 'myrobot', loadChildren: './members/robot/myrobot/myrobot.module#MyrobotPageModule' , canActivate: [AuthGuard]},
  { path: 'change', loadChildren: './members/robot/change/change.module#ChangePageModule' , canActivate: [AuthGuard]},
  { path: 'question', loadChildren: './members/recycle/question/question.module#QuestionPageModule' , canActivate: [AuthGuard]},
  { path: '**', redirectTo: 'game-selection', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

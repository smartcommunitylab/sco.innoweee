import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './auth/auth-guard.service';


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
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuardService]},
  { path: 'game-selection', loadChildren: './members/game-selection/game-selection.module#GameSelectionPageModule', canActivate: [AuthGuardService] },
  { path: 'start', loadChildren: './members/recycle/start/start.module#StartPageModule' },
  { path: 'item-classification/:item', loadChildren: './members/recycle/item-classification/item-classification.module#ItemClassificationPageModule' },
  { path: 'item-loaded/:idItem/:manual', loadChildren: './members/recycle/item-loaded/item-loaded.module#ItemLoadedPageModule' },
  { path: 'recycle-results', loadChildren: './members/recycle/recycle-results/recycle-results.module#RecycleResultsPageModule' },
  { path: 'home', loadChildren: './members/home/home.module#HomePageModule' },
  { path: 'material', loadChildren: './members/education/material/material.module#MaterialPageModule' },
  { path: 'allteam', loadChildren: './members/team/allteam/allteam.module#AllteamPageModule' },
  { path: 'myrobot', loadChildren: './members/robot/myrobot/myrobot.module#MyrobotPageModule' },
  { path: 'change', loadChildren: './members/robot/change/change.module#ChangePageModule' },
  { path: 'item-confirm/:item', loadChildren: './members/recycle/item-confirm/item-confirm.module#ItemConfirmPageModule' },
  { path: 'question', loadChildren: './members/recycle/question/question.module#QuestionPageModule' },
  { path: 'callback', loadChildren: './auth/implicit/auth-callback/auth-callback.module#AuthCallbackPageModule' },
    { path: 'logout', loadChildren: './auth/implicit/end-session/end-session.module#EndSessionPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: '**', redirectTo: 'game-selection', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

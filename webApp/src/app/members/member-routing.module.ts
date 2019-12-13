import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
const routes: Routes = [
  { path: 'game-selection', loadChildren: './game-selection/game-selection.module#GameSelectionPageModule' },
  { path: 'start', loadChildren: './recycle/start/start.module#StartPageModule' },
  { path: 'item-classification/:item', loadChildren: './recycle/item-classification/item-classification.module#ItemClassificationPageModule' },
  { path: 'item-loaded/:idItem/:manual', loadChildren: './recycle/item-loaded/item-loaded.module#ItemLoadedPageModule' },
  { path: 'recycle-results', loadChildren: './recycle/recycle-results/recycle-results.module#RecycleResultsPageModule' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'material', loadChildren: './education/material/material.module#MaterialPageModule' },
  { path: 'allteam', loadChildren: './team/allteam/allteam.module#AllteamPageModule' },
  { path: 'myrobot', loadChildren: './robot/myrobot/myrobot.module#MyrobotPageModule' },
  { path: 'change', loadChildren: './robot/change/change.module#ChangePageModule' },
  { path: 'question', loadChildren: './recycle/question/question.module#QuestionPageModule' }
];
 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class MemberRoutingModule { }
import { NgModule, Directive,OnInit, EventEmitter, Output, OnDestroy, Input,ElementRef,Renderer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PointComponent } from './components/point/point.component';
import { ResourceComponent } from './components/resource/resource.component';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ComparisonComponent } from './components/comparison/comparison.component';


@NgModule({
  imports: [
    IonicModule,CommonModule,TranslateModule
  ],
  declarations: [
    PointComponent,ResourceComponent, ComparisonComponent
  ],
  exports: [
    PointComponent,ResourceComponent, ComparisonComponent
  ]
})

export class SharedModule { }
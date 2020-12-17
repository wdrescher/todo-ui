import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { TaskComponent } from './task/task.component'; 

@NgModule({
  declarations: [
    HomeComponent,
    TaskComponent
  ],
  imports: [
    CommonModule
  ], 
  exports: [
    HomeComponent
  ]
})
export class HomeModule { }

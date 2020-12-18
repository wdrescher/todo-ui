import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';

import { HomeComponent } from './home.component';
import { TaskComponent } from './task/task.component'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    HomeComponent,
    TaskComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule, 
    ClickOutsideModule
  ], 
  exports: [
  ]
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderComponent } from './header/header.component';
import { LoadingComponent } from './loading/loading.component';
import { FooterComponent } from './footer/footer.component'; 

@NgModule({
  declarations: [
    HeaderComponent, 
    LoadingComponent, 
    FooterComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
  ], 
  exports: [ 
    HeaderComponent,
    FooterComponent,
    ReactiveFormsModule, 
    LoadingComponent
  ]
})
export class SharedModule {}

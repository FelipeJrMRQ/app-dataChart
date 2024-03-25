import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TesteRoutingModule } from './teste-routing.module';
import { CreationComponent } from './creation/creation.component';
import { DlgTesteComponent } from './dlg-teste/dlg-teste.component';
import { AppModule } from 'src/app/app.module';




@NgModule({
  declarations: [
    CreationComponent,
    DlgTesteComponent
  ],
  imports: [
    CommonModule,
    TesteRoutingModule,
    FormsModule
  ]
})
export class TesteModule { }

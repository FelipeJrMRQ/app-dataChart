import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtualizadorRoutingModule } from './atualizador-routing.module';
import { AtualizadorFormComponent } from './atualizador-form/atualizador-form.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AtualizadorFormComponent
  ],
  imports: [
    CommonModule,
    AtualizadorRoutingModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    
  ]
})
export class AtualizadorModule { }

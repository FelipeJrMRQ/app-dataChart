import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItensProgramadosRoutingModule } from './itens-programados-routing.module';
import { ItensProgramadosFormComponent } from './itens-programados-form/itens-programados-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DlgDetalheItemComponent } from './dlg-detalhe-item/dlg-detalhe-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent
  ],
  imports: [
    CommonModule,
    ItensProgramadosRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent
  ]
})
export class ItensProgramadosModule { }

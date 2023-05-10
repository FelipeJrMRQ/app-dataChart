import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItensProgramadosRoutingModule } from './itens-programados-routing.module';
import { ItensProgramadosFormComponent } from './itens-programados-form/itens-programados-form.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DlgDetalheItemComponent } from './dlg-detalhe-item/dlg-detalhe-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DlgAlterarSetupComponent } from './dlg-alterar-setup/dlg-alterar-setup.component';


@NgModule({
  declarations: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent,
    DlgAlterarSetupComponent
  ],
  imports: [
    CommonModule,
    ItensProgramadosRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  exports: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent
  ]
})
export class ItensProgramadosModule { }

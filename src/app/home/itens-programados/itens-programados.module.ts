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
import { MatSortModule } from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import { DlgDetalheObservacaoComponent } from './dlg-detalhe-observacao/dlg-detalhe-observacao.component';
import { DlgCadastroMotivoComponent } from './dlg-cadastro-motivo/dlg-cadastro-motivo.component';


@NgModule({
  declarations: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent,
    DlgAlterarSetupComponent,
    DlgDetalheObservacaoComponent,
    DlgCadastroMotivoComponent
  ],
  imports: [
    CommonModule,
    ItensProgramadosRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule,
  ],
  exports: [
    ItensProgramadosFormComponent,
    DlgDetalheItemComponent
  ]
})
export class ItensProgramadosModule { }

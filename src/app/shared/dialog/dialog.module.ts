import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogRoutingModule } from './dialog-routing.module';
import { DlgFatMensalProdutoComponent } from './dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DlgUpdateSenhaComponent } from './dlg-update-senha/dlg-update-senha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    DlgFatMensalProdutoComponent,
    DlgUpdateSenhaComponent
  ],
  imports: [
    CommonModule,
    DialogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ]
})
export class DialogModule { }

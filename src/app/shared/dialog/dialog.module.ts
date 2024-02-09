import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogRoutingModule } from './dialog-routing.module';
import { DlgFatMensalProdutoComponent } from './dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DlgUpdateSenhaComponent } from './dlg-update-senha/dlg-update-senha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DglConfirmacaoComponent } from './dgl-confirmacao/dgl-confirmacao.component';
import { DlgExclusaoComponent } from './dlg-exclusao/dlg-exclusao.component';
import { DlgLoadingComponent } from './dlg-loading/dlg-loading.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NotificacaoComponent } from './notificacao/notificacao.component';
import { LoadingPageModule } from '../loading-page/loading-page.module';


@NgModule({
  declarations: [
    DlgFatMensalProdutoComponent,
    DlgUpdateSenhaComponent,
    DglConfirmacaoComponent,
    DlgExclusaoComponent,
    DlgLoadingComponent,
    NotificacaoComponent,
  ],
  imports: [
    CommonModule,
    DialogRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatProgressBarModule,
    LoadingPageModule
  ]
})
export class DialogModule { }

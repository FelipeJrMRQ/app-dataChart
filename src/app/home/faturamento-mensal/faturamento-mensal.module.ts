import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaturamentoMensalRoutingModule } from './faturamento-mensal-routing.module';
import { FaturamentoClienteComponent } from './faturamento-cliente/faturamento-cliente.component';
import { FaturamentoDatalheComponent } from './faturamento-datalhe/faturamento-datalhe.component';
import { ProdutoDetalheComponent } from './faturamento-cliente/produto-detalhe/produto-detalhe.component';
import { FaturamentoBeneficiamentoComponent } from './faturamento-beneficiamento/faturamento-beneficiamento.component';
import { ClienteDetalheComponent } from './faturamento-beneficiamento/cliente-detalhe/cliente-detalhe.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialogModule } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DialogModule } from '@angular/cdk/dialog';
import { MatSortModule } from '@angular/material/sort';
import { ExtratoProdutoAnualComponent } from './extrato-produto-anual/extrato-produto-anual.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';



@NgModule({
  declarations: [
    FaturamentoClienteComponent,
    FaturamentoDatalheComponent,
    ProdutoDetalheComponent,
    FaturamentoBeneficiamentoComponent,
    ClienteDetalheComponent,
    ExtratoProdutoAnualComponent,
  ],
  imports: [
    CommonModule,
    FaturamentoMensalRoutingModule,
    NgxPaginationModule,
    MatDialogModule,
    DialogModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ]
})
export class FaturamentoMensalModule { }

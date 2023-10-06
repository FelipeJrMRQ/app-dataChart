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
import { DialogModule } from '@angular/cdk/dialog';
import { MatSortModule } from '@angular/material/sort';
import { ExtratoProdutoAnualComponent } from './extrato-anual-produto/extrato-produto-anual.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoadingPageModule } from 'src/app/shared/loading-page/loading-page.module';
import { ExtratoBeneficiamentoAnualComponent } from './extrato-anual-beneficiamento/extrato-beneficiamento-anual.component';



@NgModule({
  declarations: [
    FaturamentoClienteComponent,
    FaturamentoDatalheComponent,
    ProdutoDetalheComponent,
    FaturamentoBeneficiamentoComponent,
    ClienteDetalheComponent,
    ExtratoProdutoAnualComponent,
    ExtratoBeneficiamentoAnualComponent,
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
    LoadingPageModule
  ]
})
export class FaturamentoMensalModule { }

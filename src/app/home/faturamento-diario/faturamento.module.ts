import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaturamentoRoutingModule } from './faturamento-routing.module';
import { FaturamentoClienteComponent } from './faturamento-cliente/faturamento-cliente.component';
import { FaturamentoProdutoComponent } from './faturamento-produto/faturamento-produto.component';
import { MatSortModule } from '@angular/material/sort';
import { FaturamentoBeneficiamentoComponent } from './faturamento-beneficiamento/faturamento-beneficiamento.component';
import { FormsModule } from '@angular/forms';
import { FaturamentoFormComponent } from './faturamento-form/faturamento-form.component';


@NgModule({
  declarations: [
    FaturamentoClienteComponent,
    FaturamentoProdutoComponent,
    FaturamentoBeneficiamentoComponent,
    FaturamentoFormComponent,
  ],
  imports: [
    CommonModule,
    FaturamentoRoutingModule,
    MatSortModule,
    FormsModule,
    MatPaginatorModule,
    NgxPaginationModule,
  ]
})
export class FaturamentoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaturamentoPeriodoRoutingModule } from './faturamento-periodo-routing.module';
import { TblFaturamentoClienteComponent } from './tbl-faturamento-cliente/tbl-faturamento-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TblFaturamentoClienteComponent
  ],
  imports: [
    CommonModule,
    FaturamentoPeriodoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FaturamentoPeriodoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaturamentoPeriodoRoutingModule } from './faturamento-periodo-routing.module';
import { TblFaturamentoClienteComponent } from './tbl-faturamento-cliente/tbl-faturamento-cliente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingPageModule } from 'src/app/shared/loading-page/loading-page.module';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    TblFaturamentoClienteComponent
  ],
  imports: [
    CommonModule,
    FaturamentoPeriodoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    LoadingPageModule,
    NgxPaginationModule,
  ]
})
export class FaturamentoPeriodoModule { }

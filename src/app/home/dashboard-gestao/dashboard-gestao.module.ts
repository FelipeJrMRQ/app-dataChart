import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentComponent } from './content/content.component';
import { GraficoBacklogTotalComponent } from './grafico-backlog-total/grafico-backlog-total.component';
import { GraficoBacklogComparativoComponent } from './grafico-backlog-comparativo/grafico-backlog-comparativo.component';
import { DashboardGestaoRoutingModule } from './dashboard-gestao-routing.module';
import { GraficoFaturamentoAcumuladoComponent } from './grafico-faturamento-acumulado/grafico-faturamento-acumulado.component';
import { GraficoEntradaAcumuladaComponent } from './grafico-entrada-acumulada/grafico-entrada-acumulada.component';
import { GraficoFaturamentoMensalComponent } from './grafico-faturamento-mensal/grafico-faturamento-mensal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TblFaturamentoAcumuladoComponent } from './tbl-faturamento-acumulado/tbl-faturamento-acumulado.component';
import { TblFaturamentoMensalComponent } from './tbl-faturamento-mensal/tbl-faturamento-mensal.component';
import { GraficoEntradaMensalComponent } from './grafico-entrada-mensal/grafico-entrada-mensal.component';
import { TblEntradaAcumuladaComponent } from './tbl-entrada-acumulada/tbl-entrada-acumulada.component';
import { TblEntradaMensalComponent } from './tbl-entrada-mensal/tbl-entrada-mensal.component';
import { CardInformacoesComponent } from './card-informacoes/card-informacoes.component';
import NumeroAbreviadoPipe from 'src/app/pipes/numero-abreviado.pipe';


@NgModule({
  declarations: [
    ContentComponent,
    GraficoBacklogTotalComponent,
    GraficoBacklogComparativoComponent,
    GraficoFaturamentoAcumuladoComponent,
    GraficoEntradaAcumuladaComponent,
    GraficoFaturamentoMensalComponent,
    TblFaturamentoAcumuladoComponent,
    TblFaturamentoMensalComponent,
    GraficoEntradaMensalComponent,
    TblEntradaAcumuladaComponent,
    TblEntradaMensalComponent,
    CardInformacoesComponent,
    NumeroAbreviadoPipe,
  ],
  imports: [
    CommonModule,
    DashboardGestaoRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardGestaoModule { }

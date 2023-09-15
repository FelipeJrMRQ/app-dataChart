import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardSinteticoRoutingModule } from './dashboard-sintetico-routing.module';
import { CardDiaComponent } from './card-dia/card-dia.component';
import { CardMesComponent } from './card-mes/card-mes.component';
import { ContentComponent } from './content/content.component';
import { CardMediaComponent } from './card-media/card-media.component';
import { CardPeriodoComponent } from './card-periodo/card-periodo.component';
import { CardMetaComponent } from './card-meta/card-meta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardOutrosComponent } from './card-outros/card-outros.component';
import { GraficoFaturamentoDiarioComponent } from './grafico-faturamento-diario/grafico-faturamento-diario.component';
import { GraficoFaturamentoMensalComponent } from './grafico-faturamento-mensal/grafico-faturamento-mensal.component';
import { GraficoComparativoAnualComponent } from './grafico-comparativo-anual/grafico-comparativo-anual.component';
import { GraficoEntradasMesComponent } from './grafico-entradas-mes/grafico-entradas-mes.component';
import { GraficoFaturamentoAnoAnteriorComponent } from './grafico-faturamento-ano-anterior/grafico-faturamento-ano-anterior.component';
import { GraficoEvolucaoCarteiraComponent } from './grafico-evolucao-carteira/grafico-evolucao-carteira.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'src/app/shared/dialog/dialog.module';
import { GraficoNovosItensComponent } from './grafico-novos-itens/grafico-novos-itens.component';
import { TblNovosItensComponent } from './tbl-novos-itens/tbl-novos-itens.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { GraficoItensNaoRetornadosComponent } from './grafico-movimentacao-produtos/grafico-movimentacao-produtos.component';
import { CardMovimentacaoComponent } from './tbl-movimento-produtos/tbl-movimento-produtos.component';
import { GraficoMovimentoMensalComponent } from './grafico-movimento-mensal/grafico-movimento-mensal.component';
import { LoadingPageModule } from 'src/app/shared/loading-page/loading-page.module';


@NgModule({
  declarations: [
    CardDiaComponent,
    CardMesComponent,
    ContentComponent,
    CardMediaComponent,
    CardPeriodoComponent,
    CardMetaComponent,
    CardOutrosComponent,
    GraficoFaturamentoDiarioComponent,
    GraficoFaturamentoMensalComponent,
    GraficoComparativoAnualComponent,
    GraficoEntradasMesComponent,
    GraficoFaturamentoAnoAnteriorComponent,
    GraficoEvolucaoCarteiraComponent,
    GraficoNovosItensComponent,
    GraficoItensNaoRetornadosComponent,
    TblNovosItensComponent,
    CardMovimentacaoComponent,
    GraficoMovimentoMensalComponent,
  ],
  imports: [
    CommonModule,
    DashboardSinteticoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DialogModule,
    NgxPaginationModule,
    LoadingPageModule
  ]
})
export class DashboardSinteticoModule { }

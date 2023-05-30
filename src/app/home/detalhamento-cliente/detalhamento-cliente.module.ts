import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetalhamentoClienteRoutingModule } from './detalhamento-cliente-routing.module';
import { DetalhamentoClienteFormComponent } from './detalhamento-cliente-form/detalhamento-cliente-form.component';
import { CardFaturamentoComponent } from './card-faturamento/card-faturamento.component';
import { CardEntradasComponent } from './card-entradas/card-entradas.component';
import { CardMediasComponent } from './card-medias/card-medias.component';
import { CardOutrosComponent } from './card-outros/card-outros.component';
import { GraficoFaturamentoDiarioComponent } from './grafico-faturamento-diario/grafico-faturamento-diario.component';
import { GraficoFaturamentoMensalComponent } from './grafico-faturamento-mensal/grafico-faturamento-mensal.component';
import { GraficoEvolucaoCarteiraComponent } from './grafico-evolucao-carteira/grafico-evolucao-carteira.component';


@NgModule({
  declarations: [
    DetalhamentoClienteFormComponent,
    CardFaturamentoComponent,
    CardEntradasComponent,
    CardMediasComponent,
    CardOutrosComponent,
    GraficoFaturamentoDiarioComponent,
    GraficoFaturamentoMensalComponent,
    GraficoEvolucaoCarteiraComponent
  ],
  imports: [
    CommonModule,
    DetalhamentoClienteRoutingModule
  ]
})
export class DetalhamentoClienteModule { }

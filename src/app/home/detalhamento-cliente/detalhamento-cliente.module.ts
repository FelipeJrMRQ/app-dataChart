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
import { TblFaturamentoProdComponent } from './tbl-faturamento-prod/tbl-faturamento-prod.component';
import { TblFaturamentoBenefComponent } from './tbl-faturamento-benef/tbl-faturamento-benef.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TblItensMovimentacaoComponent } from './tbl-itens-movimentacao/tbl-itens-movimentacao.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';



@NgModule({
  declarations: [
    DetalhamentoClienteFormComponent,
    CardFaturamentoComponent,
    CardEntradasComponent,
    CardMediasComponent,
    CardOutrosComponent,
    GraficoFaturamentoDiarioComponent,
    GraficoFaturamentoMensalComponent,
    GraficoEvolucaoCarteiraComponent,
    TblFaturamentoProdComponent,
    TblFaturamentoBenefComponent,
    TblItensMovimentacaoComponent,
  ],
  imports: [
    CommonModule,
    DetalhamentoClienteRoutingModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatFormFieldModule
  ]
})
export class DetalhamentoClienteModule { }

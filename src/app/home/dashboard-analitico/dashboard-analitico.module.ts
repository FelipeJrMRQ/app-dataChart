import { FaturamentoModule } from '../faturamento-diario/faturamento.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardAnaliticoRoutingModule } from './dashboard-analitico-routing.module';
import { DashboardAnaliticoComponent } from './dashboard-content/dashboard-analitico.component';
import { CardsComponent } from './cards/cards.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import {MatPaginatorModule} from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { TblEntradasDiariaComponent } from './dashboard-content/tbl-entradas-diaria/tbl-entradas-diaria.component';
import { TblFaturamentoDiarioComponent } from './dashboard-content/tbl-faturamento-diario/tbl-faturamento-diario.component';
import { TblCarteiraClienteComponent } from './dashboard-content/tbl-carteira-cliente/tbl-carteira-cliente.component';
import { TblCarteiraBeneficiamentoComponent } from './dashboard-content/tbl-carteira-beneficiamento/tbl-carteira-beneficiamento.component';
import { CardMesComponent } from './cards/card-mes/card-mes.component';
import { CardDiaComponent } from './cards/card-dia/card-dia.component';
import { MatSortModule } from '@angular/material/sort';




@NgModule({
  declarations: [
    DashboardAnaliticoComponent,
    CardsComponent,
    TblEntradasDiariaComponent,
    TblFaturamentoDiarioComponent,
    TblCarteiraClienteComponent,
    TblCarteiraBeneficiamentoComponent,
    CardMesComponent,
    CardDiaComponent,
  ],
  imports: [
    CommonModule,
    DashboardAnaliticoRoutingModule,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    MatSliderModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatDatepickerModule,
    FaturamentoModule,
    MatSortModule,
  ]
})
export class DashboardModule { 

  

}

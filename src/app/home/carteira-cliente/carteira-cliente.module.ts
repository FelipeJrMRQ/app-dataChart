import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteiraClienteRoutingModule } from './carteira-cliente-routing.module';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraBeneficiamentoComponent } from './carteira-beneficiamento/carteira-beneficiamento.component';
import { CarteiraProdutoComponent } from './carteira-produto/carteira-produto.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [
    CarteiraFormComponent,
    CarteiraBeneficiamentoComponent,
    CarteiraProdutoComponent
  ],
  imports: [
    CommonModule,
    CarteiraClienteRoutingModule,
    FormsModule,
    NgxPaginationModule,
    MatPaginatorModule,
    MatSortModule,
  ]
})
export class CarteiraClienteModule { }

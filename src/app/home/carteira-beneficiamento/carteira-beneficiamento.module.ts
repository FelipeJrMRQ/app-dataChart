import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarteiraBeneficiamentoRoutingModule } from './carteira-beneficiamento-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatSortModule } from '@angular/material/sort';
import { CarteiraProdutoComponent } from './carteira-produto/carteira-produto.component';
import { CarteiraClienteComponent } from './carteira-cliente/carteira-cliente.component';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    CarteiraClienteComponent,
    CarteiraProdutoComponent,
    CarteiraFormComponent
  ],
  imports: [
    CommonModule,
    CarteiraBeneficiamentoRoutingModule,
    FormsModule,
    RouterModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatSortModule,
    MatSnackBarModule,
  ]
})
export class CarteiraBeneficiamentoModule { }

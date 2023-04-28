import { NgxPaginationModule } from 'ngx-pagination';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntradaRoutingModule } from './entrada-routing.module';
import { EntradaFormComponent } from './entrada-form/entrada-form.component';
import { EntradaBeneficiamentoComponent } from './entrada-beneficiamento/entrada-beneficiamento.component';
import { EntradaClienteComponent } from './entrada-cliente/entrada-cliente.component';
import { EntradaProdutoComponent } from './entrada-produto/entrada-produto.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { ProdutosBeneficiamentoComponent } from './entrada-produto/produtos-beneficiamento/produtos-beneficiamento.component';
import { EntradaBeneficiamentoClienteComponent } from './entrada-beneficiamento/entrada-beneficiamento-cliente/entrada-beneficiamento-cliente.component';
import { BeneficiamentoProdutosComponent } from './entrada-beneficiamento/entrada-beneficiamento-cliente/entrada-beneficiamento-produtos/beneficiamento-produtos.component';
import { ExtratoAnualComponent } from './extrato-anual/extrato-anual.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';



@NgModule({
  declarations: [
    EntradaFormComponent,
    EntradaBeneficiamentoComponent,
    EntradaClienteComponent,
    EntradaProdutoComponent,
    ProdutosBeneficiamentoComponent,
    EntradaBeneficiamentoClienteComponent,
    BeneficiamentoProdutosComponent,
    ExtratoAnualComponent,
  ],
  imports: [
    CommonModule,
    EntradaRoutingModule,
    FormsModule,
    MatSortModule,
    MatPaginatorModule,
    NgxPaginationModule,
    MatProgressBarModule,
    
  ]
})
export class EntradaModule { }

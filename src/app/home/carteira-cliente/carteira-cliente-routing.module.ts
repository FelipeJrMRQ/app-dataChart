import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraProdutoComponent } from './carteira-produto/carteira-produto.component';

const routes: Routes = [
  {path : '', component: CarteiraFormComponent},
  {path: 'carteira-cliente/:cdCliente/:cdBeneficiamento/:data/:nomeCliente', component: CarteiraProdutoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteiraClienteRoutingModule { }

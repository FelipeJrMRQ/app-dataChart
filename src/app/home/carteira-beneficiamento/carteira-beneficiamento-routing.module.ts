import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarteiraClienteComponent } from './carteira-cliente/carteira-cliente.component';
import { CarteiraFormComponent } from './carteira-form/carteira-form.component';
import { CarteiraProdutoComponent } from './carteira-produto/carteira-produto.component';

const routes: Routes = [
  {path: '', component: CarteiraFormComponent},
  {path: 'carteira-beneficiamento/:cdBeneficiamento/:data/:nome', component: CarteiraClienteComponent},
  {path: 'carteira-beneficiamento/:cdBeneficiamento/:cdCliente/:data/:nome', component: CarteiraProdutoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarteiraBeneficiamentoRoutingModule { }

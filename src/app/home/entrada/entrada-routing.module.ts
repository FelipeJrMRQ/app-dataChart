import { EntradaBeneficiamentoClienteComponent } from './entrada-beneficiamento/entrada-beneficiamento-cliente/entrada-beneficiamento-cliente.component';
import { ProdutosBeneficiamentoComponent } from './entrada-produto/produtos-beneficiamento/produtos-beneficiamento.component';
import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { EntradaFormComponent } from './entrada-form/entrada-form.component';
import { EntradaProdutoComponent } from './entrada-produto/entrada-produto.component';
import { BeneficiamentoProdutosComponent } from './entrada-beneficiamento/entrada-beneficiamento-cliente/entrada-beneficiamento-produtos/beneficiamento-produtos.component';
import { ExtratoAnualComponent } from './extrato-anual/extrato-anual.component';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';

const routes: Routes = [
  
  { path: 'entrada/cliente/:data', component: EntradaFormComponent , canActivate: [AuthGuardService] },
  { path: 'entrada-extrato-anual/:data/:cdCliente/:nomeCliente', component: ExtratoAnualComponent, canActivate: [AuthGuardService] },
  
  //Entrada-beneficiamento rotas
  { path: 'entrada/beneficiamento/cliente/:cdBeneficiamento/:data/:nomeBeneficiamento', component: EntradaBeneficiamentoClienteComponent, canActivate: [AuthGuardService] },
  { path: 'entrada/beneficiamento/produto/:cdBeneficiamento/:cdCliente/:data/:nomeCliente', component:BeneficiamentoProdutosComponent, canActivate: [AuthGuardService] },

  //Entrada-clientes rotas 
  { path: 'entrada/produto/:cdCliente/:data/:nomeCliente', component: EntradaProdutoComponent , canActivate: [AuthGuardService] },
  { path: 'entrada/produto/beneficiamento/:cdCliente/:cdBeneficiamento/:data/:nomeCliente',component:ProdutosBeneficiamentoComponent, canActivate: [AuthGuardService] },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntradaRoutingModule { }

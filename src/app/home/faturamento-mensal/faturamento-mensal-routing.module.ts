import { ExtratoProdutoAnualComponent } from './extrato-anual-produto/extrato-produto-anual.component';
import { ClienteDetalheComponent } from './faturamento-beneficiamento/cliente-detalhe/cliente-detalhe.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaturamentoBeneficiamentoComponent } from './faturamento-beneficiamento/faturamento-beneficiamento.component';
import { FaturamentoClienteComponent } from './faturamento-cliente/faturamento-cliente.component';
import { ProdutoDetalheComponent } from './faturamento-cliente/produto-detalhe/produto-detalhe.component';
import { FaturamentoDatalheComponent } from './faturamento-datalhe/faturamento-datalhe.component';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';
import { ExtratoBeneficiamentoAnualComponent } from './extrato-anual-beneficiamento/extrato-beneficiamento-anual.component';

const routes: Routes = [
  { path: '', component: FaturamentoDatalheComponent },
  { path: 'faturamento-mensal/cliente/:cdCliente/:nomeCliente/:data', component: FaturamentoClienteComponent, canActivate:[AuthGuardService] },
  { path: 'faturamento-mensal/beneficiamento/:cdBeneficiamento/:nomeBeneficiamento/:data', component: FaturamentoBeneficiamentoComponent , canActivate:[AuthGuardService]},
  { path: 'faturamento-mensal/detalhe-cliente/:cdCliente/:cdBeneficiamento/:nomeBeneficiamento/:nomeCliente/:data', component: ClienteDetalheComponent , canActivate:[AuthGuardService]},
  { path: 'faturamento-mensal/detalhe-beneficiamento/:cdCliente/:cdBeneficiamento/:nomeCliente/:data', component: ProdutoDetalheComponent },
  { path: 'faturamento-extrato-anual/cliente/:data/:cdCliente/:nomeCliente', component: ExtratoProdutoAnualComponent, canActivate:[AuthGuardService]}, 
  { path: 'faturamento-extrato-anual-beneficiamento/cliente/:data/:cdCliente/:nomeCliente', component: ExtratoBeneficiamentoAnualComponent}, 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaturamentoMensalRoutingModule { }

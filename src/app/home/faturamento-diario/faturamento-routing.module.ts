import { NgModule } from '@angular/core';

import { FaturamentoClienteComponent } from './faturamento-cliente/faturamento-cliente.component';
import { FaturamentoProdutoComponent } from './faturamento-produto/faturamento-produto.component';

import { RouterModule, Routes } from '@angular/router';
import { FaturamentoFormComponent } from './faturamento-form/faturamento-form.component';
import { AuthGuardService } from 'src/app/guards/auth-guard.service';

const routes: Routes = [
  {path: '',component:FaturamentoFormComponent},
  {path: 'faturamento-diario/produto/:id/:data/:nomeCliente', component:FaturamentoProdutoComponent, canActivate: [AuthGuardService] },
  {path: 'faturamento-diario/beneficiamento/:cdBeneficiamento/:data/:nomeBeneficiamento', component: FaturamentoClienteComponent, canActivate: [AuthGuardService]},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaturamentoRoutingModule { }

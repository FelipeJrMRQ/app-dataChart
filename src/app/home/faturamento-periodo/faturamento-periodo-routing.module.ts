import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TblFaturamentoClienteComponent } from './tbl-faturamento-cliente/tbl-faturamento-cliente.component';

const routes: Routes = [
  {path: '', component: TblFaturamentoClienteComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaturamentoPeriodoRoutingModule { }

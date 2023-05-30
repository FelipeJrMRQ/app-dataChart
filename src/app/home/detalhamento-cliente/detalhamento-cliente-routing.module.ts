import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetalhamentoClienteFormComponent } from './detalhamento-cliente-form/detalhamento-cliente-form.component';

const routes: Routes = [
  {path: '', component: DetalhamentoClienteFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DetalhamentoClienteRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItensProgramadosFormComponent } from './itens-programados-form/itens-programados-form.component';

const routes: Routes = [
  {path : '', component: ItensProgramadosFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItensProgramadosRoutingModule { }

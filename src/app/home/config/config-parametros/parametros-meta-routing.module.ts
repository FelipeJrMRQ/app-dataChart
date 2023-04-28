import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametrosMetaFormComponent } from './parametros-meta-form/parametros-meta-form.component';


const routes: Routes = [
  {path: '', component : ParametrosMetaFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ParametrosMetaRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaFormComponent } from './tela-form/tela-form.component';

const routes: Routes = [
    {path: '', component: TelaFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigTelaRoutingModule { }

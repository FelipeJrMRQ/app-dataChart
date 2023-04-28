import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgramacaoFormComponent } from './programacao-form/programacao-form.component';

const routes: Routes = [
  { path: '', component: ProgramacaoFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramacaoRoutingModule { }

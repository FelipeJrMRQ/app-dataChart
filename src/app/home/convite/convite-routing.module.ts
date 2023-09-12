import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConviteFormComponent } from './convite-form/convite-form.component';
import { SenhaFormComponent } from './senha-form/senha-form.component';

const routes: Routes = [
  {path: '', component: ConviteFormComponent},
  {path: 'recuperar-senha', component: SenhaFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConviteRoutingModule { }

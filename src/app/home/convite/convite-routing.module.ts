import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConviteFormComponent } from './convite-form/convite-form.component';

const routes: Routes = [
  {path: '', component: ConviteFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConviteRoutingModule { }

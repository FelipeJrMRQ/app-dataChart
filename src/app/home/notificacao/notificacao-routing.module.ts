import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificacaoFormComponent } from './notificacao-form/notificacao-form.component';

const routes: Routes = [
  {path : '', component: NotificacaoFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificacaoRoutingModule { }

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { HistoricoAtividadesSistemaComponent } from './historico-atividades-sistema/historico-atividades-sistema.component';

const routes: Routes = [
  {path: '', component: UsuarioFormComponent},
  {path: 'historico-atividades-sistema', component: HistoricoAtividadesSistemaComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }

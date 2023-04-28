import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HistoricoAtividadesSistemaComponent } from './historico-atividades-sistema/historico-atividades-sistema.component';


@NgModule({
  declarations: [
    UsuarioFormComponent,
    HistoricoAtividadesSistemaComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatExpansionModule,
    MatTooltipModule,
  ]
})
export class UsuarioModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministracaoRoutingModule } from './administracao-routing.module';
import { AdministracaoFormComponent } from './administracao-form/administracao-form.component';
import { CardsComponent } from './cards/cards.component';
import { TblAcessosTelaComponent } from './tbl-acessos-tela/tbl-acessos-tela.component';
import { TblLogSistemaComponent } from './tbl-log-sistema/tbl-log-sistema.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AdministracaoFormComponent,
    CardsComponent,
    TblAcessosTelaComponent,
    TblLogSistemaComponent
  ],
  imports: [
    CommonModule,
    AdministracaoRoutingModule,
    NgxPaginationModule,
  ]
})
export class AdministracaoModule { }

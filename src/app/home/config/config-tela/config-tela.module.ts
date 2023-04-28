import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';

import { ConfigTelaRoutingModule } from './config-tela-routing.module';
import { TelaFormComponent } from './tela-form/tela-form.component';
import { DlgCadastroTelaComponent } from './dlg-cadastro-tela/dlg-cadastro-tela.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    TelaFormComponent,
    DlgCadastroTelaComponent
  ],
  imports: [
    CommonModule,
    ConfigTelaRoutingModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
  ]
})
export class ConfigTelaModule { }

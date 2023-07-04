import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificacaoRoutingModule } from './notificacao-routing.module';
import { NotificacaoFormComponent } from './notificacao-form/notificacao-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from '@angular/cdk/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';



@NgModule({
  declarations: [
    NotificacaoFormComponent
  ],
  imports: [
    CommonModule,
    NotificacaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DialogModule,
    MatSnackBarModule,
    MatDialogModule,
  ]
})
export class NotificacaoModule { }

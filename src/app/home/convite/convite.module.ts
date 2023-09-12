import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConviteRoutingModule } from './convite-routing.module';
import { ConviteFormComponent } from './convite-form/convite-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DlgUpdatePasswordComponent } from './dlg-update-password/dlg-update-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SenhaFormComponent } from './senha-form/senha-form.component';


@NgModule({
  declarations: [
    ConviteFormComponent,
    DlgUpdatePasswordComponent,
    SenhaFormComponent
  ],
  imports: [
    CommonModule,
    ConviteRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ]
})
export class ConviteModule { }

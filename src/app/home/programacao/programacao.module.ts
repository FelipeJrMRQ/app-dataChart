import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramacaoRoutingModule } from './programacao-routing.module';
import { ProgramacaoFormComponent } from './programacao-form/programacao-form.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { DlgProgramacaoComponent } from './dlg-programacao/dlg-programacao.component';
import { MatDialogModule } from '@angular/material/dialog';
import { DlgCadLinhaComponent } from './dlg-cad-linha/dlg-cad-linha.component';
import { DlgCadTurnoComponent } from './dlg-cad-turno/dlg-cad-turno.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DlgConfirmaSetupMistoComponent } from './dlg-confirma-setup-misto/dlg-confirma-setup-misto.component';



@NgModule({
  declarations: [
    ProgramacaoFormComponent,
    DlgProgramacaoComponent,
    DlgCadLinhaComponent,
    DlgCadTurnoComponent,
    DlgConfirmaSetupMistoComponent,
  ],
  imports: [
    CommonModule,
    ProgramacaoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    MatSortModule,
    MatDialogModule,
    DragDropModule,
    MatSnackBarModule,
    MatProgressBarModule
  ]
})
export class ProgramacaoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalRoutingModule } from './modal-routing.module';
import { ModalComponent } from './modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    ModalRoutingModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSnackBarModule
  ]
})
export class ModalModule { 
}

import { FormControl, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrosMetaRoutingModule } from './parametros-meta-routing.module';
import { ParametrosMetaFormComponent } from './parametros-meta-form/parametros-meta-form.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    ParametrosMetaFormComponent,
  ],
  imports: [
    CommonModule,
    ParametrosMetaRoutingModule,
    FormsModule,
    MatPaginatorModule,
    NgxPaginationModule,
  ]
})
export class ParametrosMetaModule { }

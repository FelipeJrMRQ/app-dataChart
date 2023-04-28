import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing.module';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { DialogModule } from '../shared/dialog/dialog.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TemplateRoutingModule,
    DialogModule,
  ],
  exports:[
    HeaderComponent,
    FooterComponent
  ]
})
export class TemplateModule { }

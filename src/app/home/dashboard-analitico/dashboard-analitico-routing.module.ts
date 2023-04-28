
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAnaliticoComponent } from './dashboard-content/dashboard-analitico.component';

const routes: Routes = [
  {path: '', component: DashboardAnaliticoComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAnaliticoRoutingModule { }

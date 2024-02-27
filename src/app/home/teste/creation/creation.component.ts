import { Component, OnInit } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import { Teste } from '../teste';
import { MatDialog } from '@angular/material/dialog';
import { DlgTesteComponent } from '../dlg-teste/dlg-teste.component';
import * as moment from 'moment';
import { DateControllerService } from 'src/app/utils/date-controller.service';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {


  constructor(
   
  ) {

  }

  ngOnInit(): void {
   
  }



}

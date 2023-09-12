import { Component, OnInit } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import { Teste } from '../teste';
import { MatDialog } from '@angular/material/dialog';
import { DlgTesteComponent } from '../dlg-teste/dlg-teste.component';
import * as moment from 'moment';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {

  data = moment().format('yyyy-MM-DD');



  constructor(
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
   console.log(moment(this.data).subtract(30 ,'days').format('yyyy-MM-DD'));
  }

}

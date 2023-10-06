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

  dataRebecida = moment().format('yyyy-MM-DD');
  colunasTabela: any =[];



  constructor(
    private dialog: MatDialog,
    private dateService: DateControllerService
  ) {

  }

  ngOnInit(): void {
    this.montarColunasTabela();
  }

  montarColunasTabela(){
    this.colunasTabela = [];
    let dataInicial = moment(this.dateService.getInicioDoMes(this.dataRebecida)).subtract(12, 'months').format('yyyy-MM-DD');
    while(moment(dataInicial).isBefore(this.dateService.getInicioDoMes(this.dataRebecida))){
      dataInicial =  moment(dataInicial).add(1, 'month').format('yyyy-MM-DD');
      this.colunasTabela.push(moment(dataInicial).format('M-YY'));
    }
  }

}

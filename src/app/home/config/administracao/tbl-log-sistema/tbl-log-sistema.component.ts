import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { LogSistemaDTO } from 'src/app/models/log-sistema/log-sistema-dto';
import { LogSistemaService } from 'src/app/services/log-sistema.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-tbl-log-sistema',
  templateUrl: './tbl-log-sistema.component.html',
  styleUrls: ['./tbl-log-sistema.component.css']
})
export class TblLogSistemaComponent implements OnInit {

  logsDoSistema: LogSistemaDTO[] = [];
  pagina: any = 1;

  constructor(
    private logSistemaService: LogSistemaService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.consultarLogs();
  }

  public consultarLogs(){
    this.logSistemaService.consultaTodos(this.dateService.getInicioDoMes(moment().format('yyyy-MM-DD')), moment().format('yyyy-MM-DD')).subscribe({
      next:(res)=>{
        this.logsDoSistema = res;
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { AcessoTela } from 'src/app/models/accesso-tela';
import { LogSistemaService } from 'src/app/services/log-sistema.service';

@Component({
  selector: 'app-tbl-acessos-tela',
  templateUrl: './tbl-acessos-tela.component.html',
  styleUrls: ['./tbl-acessos-tela.component.css']
})
export class TblAcessosTelaComponent implements OnInit {

  acessosPorTela: AcessoTela[];
  pagina: any = 1;

  constructor(
    private logService: LogSistemaService
  ) { 
    this.acessosPorTela = [];
  }

  ngOnInit(): void {
    this.consultarLogSistema();
  }


  public consultarLogSistema(){

    this.logService.consultaAcessoPorTela().subscribe({
      next:(res)=>{
        this.acessosPorTela = res;
      }
    });
  }

}

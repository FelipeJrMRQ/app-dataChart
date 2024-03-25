import { Component, EventEmitter, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EntradaMensal } from 'src/app/models/entrada/entrada-mensal';
import { GraficoEntradaMensalComponent } from '../grafico-entrada-mensal/grafico-entrada-mensal.component';

@Component({
  selector: 'app-tbl-entrada-mensal',
  templateUrl: './tbl-entrada-mensal.component.html',
  styleUrls: ['./tbl-entrada-mensal.component.css']
})
export class TblEntradaMensalComponent implements OnInit {
  
  fatAnoAtual: any = [];
  fatAnoPassado: any = [];
  fatAnoRetrasado: any = [];
  entradasMensais: EntradaMensal[] = [];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  anoAtual: any;
  anoPassado: any;
  anoRetrasado: any;
  xY1: any = [];

  constructor() { }

  ngOnInit(): void {
    this.receberDados();
    this.preencherDatas();
  }

  public receberDados() {
    this.entradasMensais = [];
    GraficoEntradaMensalComponent.entradas.subscribe((res) => {
      this.entradasMensais = res;
      this.processarDados();
      this.calcularDiferencaPercentual();
    });
  }


  private processarDados() {
    let anos = [moment(this.dataRecebida).subtract(2, 'year').year(), moment(this.dataRecebida).subtract(1, 'year').year(), moment(this.dataRecebida).year()];
    anos.forEach(ano => {
      let dadosAno: any = this.entradasMensais.filter((item: any) => item.ano === ano);
      switch (ano) {
        case moment(this.dataRecebida).year():
          this.preencherValoresDoAnoAtual(dadosAno);
          break;
        case moment(this.dataRecebida).subtract(1, 'year').year():
          this.preencherValoresDoAnoPassado(dadosAno);
          break;
        case moment(this.dataRecebida).subtract(2, 'year').year():
          this.preencherValoresDoAnoRetrasado(dadosAno);
          break;
      }
    });
  }
  private preencherValoresDoAnoAtual(dadosAno: []) {
    this.fatAnoAtual = [];
    dadosAno.forEach((e: any) => {
      this.fatAnoAtual.push(e.valor)
    });
  }

  private preencherValoresDoAnoPassado(dadosAno: []) {
    this.fatAnoPassado = [];
    dadosAno.forEach((e: any) => {
      this.fatAnoPassado.push(e.valor);
    });
  }

  private preencherValoresDoAnoRetrasado(dadosAno: []) {
    this.fatAnoRetrasado = [];
    dadosAno.forEach((e: any) => {
      this.fatAnoRetrasado.push(e.valor);
    });
  }

  private preencherDatas() {
    this.anoAtual = moment(this.dataRecebida).year();
    this.anoPassado = moment(this.dataRecebida).subtract(1, 'year').year();
    this.anoRetrasado = moment(this.dataRecebida).subtract(2, 'years').year();
  }

  public calcularDiferencaPercentual() {
    let i = 0;
    this.xY1 = [];
    this.fatAnoAtual.forEach((e: any) => {
      let v1 = 0;
      let v2 = this.fatAnoPassado[i];
      let percentual = 0;
      let diferenca = 0;
        v1 = e;
        diferenca = (e - v2);
      
      percentual = ((diferenca / v1) * 100);
      this.xY1.push(percentual);
      i++;
    });
  }

}

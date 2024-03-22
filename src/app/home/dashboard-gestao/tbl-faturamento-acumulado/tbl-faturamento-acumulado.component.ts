import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { EmissorDadosService } from 'src/app/utils/emissor-dados.service';

@Component({
  selector: 'app-tbl-faturamento-acumulado',
  templateUrl: './tbl-faturamento-acumulado.component.html',
  styleUrls: ['./tbl-faturamento-acumulado.component.css']
})
export class TblFaturamentoAcumuladoComponent implements OnInit {
  fatuamentoDosUltimosAnos: FaturamentoMensal[] = []
  valorAcumuladoDoAno: any;
  valorAcumuladoDoAnoPassado: any;
  valorAcumuladoDoAnoRetrasado: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  anoAtual: any;
  anoPassado: any;
  anoRetrasado: any;
  xY1: any = [];

  constructor() { }

  ngOnInit(): void {
    this.receberDados();
    this.preencherDatas();
    this.receberData();
  }

  private receberDados() {
    EmissorDadosService.emitirDados.subscribe((res) => {
      this.fatuamentoDosUltimosAnos = res;
      this.preencherDatas();
      this.calculaFaturamentoAcumulado();
    });
  }

  private preencherDatas() {
    this.anoAtual = moment(this.dataRecebida).year();
    this.anoPassado = moment(this.dataRecebida).subtract(1, 'year').year();
    this.anoRetrasado = moment(this.dataRecebida).subtract(2, 'years').year();
  }

  private receberData() {
    DateControllerService.emitirData.subscribe((res) => {
      this.dataRecebida = res;
    });
  }

  public calculaFaturamentoAcumulado() {
    let dataInicial = moment(this.dataRecebida).subtract(2, 'years').format('yyyy-MM-DD');
    let totalAnoRetrasado = 0;
    let totalAnoPassado = 0;
    let totalDoAno = 0;
    this.valorAcumuladoDoAno = [];
    this.valorAcumuladoDoAnoPassado = [];
    this.valorAcumuladoDoAnoRetrasado = [];
    this.fatuamentoDosUltimosAnos.forEach(e => {
      if (e.ano == moment(dataInicial).year()) {
        totalAnoRetrasado += e.valor;
        this.valorAcumuladoDoAnoRetrasado.push(totalAnoRetrasado);
      } else if (e.ano > moment(dataInicial).year() && e.ano < moment(this.dataRecebida).year()) {
        totalAnoPassado += e.valor;
        this.valorAcumuladoDoAnoPassado.push(totalAnoPassado);
      } else {
        totalDoAno += e.valor;
        this.valorAcumuladoDoAno.push(totalDoAno);
      }
    });
    this.calcularDiferencaPercentual();
  }

  public calcularDiferencaPercentual() {
    let i = 0;
    this.xY1 = [];
    this.valorAcumuladoDoAno.forEach((e: any) => {
      let v1 = 0;
      let v2 = this.valorAcumuladoDoAnoPassado[i];
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

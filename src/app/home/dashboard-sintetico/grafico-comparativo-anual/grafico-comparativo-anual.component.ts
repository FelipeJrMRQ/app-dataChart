import { Component, OnInit } from '@angular/core';
import { BarController, CategoryScale, Chart, LinearScale, LineController } from 'chart.js'
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-comparativo-anual',
  templateUrl: './grafico-comparativo-anual.component.html',
  styleUrls: ['./grafico-comparativo-anual.component.css']
})
export class GraficoComparativoAnualComponent implements OnInit {
  public elementChart: any;
  public chartBarComparativo: any;

  valorAnoAnterior: any = [];
  valorAnoAtual: any = [];
  metaMes: any = [];
  arrowGap: any;
  faturamentoPorMesDoAnoAnterior: FaturamentoMensal[];
  faturamentoPorMesDoAnoAtual: FaturamentoMensal[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private parametrosMeta: ParametrosMeta[];
  private nomeTela = "dashboard-sintetico";

  constructor(
    private faturamentoMensalService: FaturamentoMensalService,
    private parametrosMetaService: ParametrosMetaService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.faturamentoPorMesDoAnoAnterior = [];
    this.faturamentoPorMesDoAnoAtual = [];
    this.parametrosMeta = [];
  }

  ngOnInit(): void {
    this.receberData();
    this.verificaPermissaoDeAcesso();
  }

  public receberData() {
    FaturamentoService.emitirData.subscribe(res => {
      this.dataRecebida = res;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_comparativo_ano_anterior', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultarFaturamentoMensalDoAnoAnterior();
      }
    });
  }

  public consultarFaturamentoMensalDoAnoAnterior() {
    let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').subtract(1, 'year').format('yyyy-MM-DD'));
    let dataFinal = (moment(this.dataRecebida).endOf('year').subtract(1, 'year').format('yyyy-MM-DD'));
    this.faturamentoMensalService.consultaTotalFaturamentoPorMes(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.faturamentoPorMesDoAnoAnterior = res;
      },
      complete: () => {
        this.valorAnoAnterior = [];
        this.faturamentoPorMesDoAnoAnterior.forEach(e => {
          this.valorAnoAnterior.push(e.valor);
        })
        this.consultarFaturamentoMensalDoAnoAtual();
      }
    });
  }

  public consultarFaturamentoMensalDoAnoAtual() {
    let dataInicial = moment(this.dataRecebida).startOf('year').format('yyyy-MM-DD');
    let dataFinal = (moment(this.dataRecebida).format('yyyy-MM-DD'));
    this.faturamentoMensalService.consultaTotalFaturamentoPorMes(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.faturamentoPorMesDoAnoAtual = res;
      },
      complete: () => {
        this.valorAnoAtual = [];
        this.faturamentoPorMesDoAnoAtual.forEach(e => {
          this.valorAnoAtual.push(e.valor);
        });
        this.atualizaGrafico();
      }
    });
  }

  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarComparativo.data.datasets[0].data = this.valorAnoAnterior;
      this.chartBarComparativo.data.datasets[1].data = this.valorAnoAtual;
      this.chartBarComparativo.data.datasets[0].label = `${moment(this.dataRecebida).subtract(1, 'year').format('yyyy')}`;
      this.chartBarComparativo.data.datasets[1].label = `${moment(this.dataRecebida).format('yyyy')}`
      this.chartBarComparativo.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }


  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBarComp');
    this.chartBarComparativo = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [{
          label: `${moment(this.dataRecebida).subtract(1, 'year').format('yyyy')}`,
          data: this.valorAnoAnterior,
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          type: 'bar',
          label: `${moment(this.dataRecebida).format('yyyy')}`,
          data: this.valorAnoAtual,
          backgroundColor: 'rgb(2, 78, 218)',
          // backgroundColor: 'rgb(237, 9, 9)',
        },
        ]
      },
      options: {
        animation: {
          duration: 3500,
        },
        scales: {
          y: {
            beginAtZero: true,
          }
        }, plugins: {
          legend: {
            fullSize: true,
            labels: {
              color: 'black',
              font: {
                size: 15,
                weight: 'bold',
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
      }
    });
  }




}

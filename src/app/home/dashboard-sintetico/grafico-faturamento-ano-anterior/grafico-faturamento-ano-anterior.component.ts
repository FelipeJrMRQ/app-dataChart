import { Component, OnInit } from '@angular/core';
import { BarController, Chart } from 'chart.js';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

Chart.register(BarController)

@Component({
  selector: 'app-grafico-faturamento-ano-anterior',
  templateUrl: './grafico-faturamento-ano-anterior.component.html',
  styleUrls: ['./grafico-faturamento-ano-anterior.component.css']
})
export class GraficoFaturamentoAnoAnteriorComponent implements OnInit {

  public elementChart: any;
  public chartBarMonth: any;

  valor: any = [];
  metaMes: any = [];
  arrowGap: any;
  faturamentoPorMes: FaturamentoMensal[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private parametrosMeta: ParametrosMeta[];
  private nomeTela = "dashboard-sintetico";

  constructor(
    private faturamentoMensalService: FaturamentoMensalService,
    private parametrosMetaService: ParametrosMetaService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.faturamentoPorMes = [];
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
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_faturamento_ano_anterior', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultarFaturamentoMensal();
      }
    });
  }

  public consultarFaturamentoMensal() {
    let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').subtract(1, 'year').format('yyyy-MM-DD'));
    let dataFinal = (moment(this.dataRecebida).endOf('year').subtract(1, 'year').format('yyyy-MM-DD'));
    this.faturamentoMensalService.consultaTotalFaturamentoPorMes(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.faturamentoPorMes = res;
      },
      complete: () => {
        this.valor = [];
        this.faturamentoPorMes.forEach(e => {
          this.valor.push(e.valor);
        })
        this.consultarMeta();
      }
    });
  }

  public consultarMeta() {
    let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').subtract(1, 'year').format('yyyy-MM-DD'));
    let dataFinal = (this.dateService.getInicioDoMes(moment(this.dataRecebida).endOf('year').subtract(1, 'year').format('yyyy-MM-DD')));
    this.parametrosMetaService.consultarParamentrosMetaPorPeriodo(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.parametrosMeta = res;
      },
      complete: () => {
        this.metaMes = [];
        this.parametrosMeta.forEach(p => {
          this.metaMes.push(p.valorMetaMensal);
        })
        this.atualizaGrafico();
      }
    })
  }

  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.valor;
      this.chartBarMonth.data.datasets[1].data = this.metaMes;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  delayed: any;
  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBarAnoAnterior');
    this.chartBarMonth = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [{
          label: `Realizado`,
          borderColor: 'red',
          data: this.valor,
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          type: 'bar',
          label: 'Meta',
          data: this.metaMes,
          backgroundColor: 'rgb(2, 78, 218)',
          // backgroundColor: 'rgb(237, 9, 9)',
        },
        ]
      },
      options: {
        animation: {
          duration: 3000,
          onComplete:()=>{
            this.delayed = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayed) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
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

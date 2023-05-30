import { Component, OnInit } from '@angular/core';
import { BarController, CategoryScale, Chart } from 'chart.js';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { EvolucaoCarteira } from 'src/app/models/carteira/evolucao-carteira';
import { ClienteService } from 'src/app/services/cliente.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

Chart.register(BarController, CategoryScale)

@Component({
  selector: 'app-grafico-evolucao-carteira',
  templateUrl: './grafico-evolucao-carteira.component.html',
  styleUrls: ['./grafico-evolucao-carteira.component.css']
})
export class GraficoEvolucaoCarteiraComponent implements OnInit {
  public elementChart: any;
  public chartBarEvolucao: any;
  valoresEvolucao: any = [];
  labelEvolucao: any = [];
  evolucaoCarteira: EvolucaoCarteira[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private nomeTela = "dashboard-sintetico";
  animacao: any;

  constructor(
    private dateService: DateControllerService,
    private clienteService: ClienteService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.evolucaoCarteira = []
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
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_evolucao_carteira', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultarValorEvolucaoCarteira();
      }
    });
  }

  private consultarValorEvolucaoCarteira() {
    this.clienteService.consultarEvolucaoCarteira(moment(this.dataRecebida).subtract(3, 'month').format('yyyy-MM-DD'), this.dataRecebida).subscribe({
      next: (res) => {
        this.evolucaoCarteira = res.objeto;
      },
      complete: () => {
        this.atualizaGrafico();
      }
    });
  }

  public atualizaGrafico() {
    this.valoresEvolucao = [];
    this.labelEvolucao = [];
    this.evolucaoCarteira.forEach(e => {
      this.valoresEvolucao.push(e.valor);
      this.labelEvolucao.push(moment(e.data).format('MM-YY'));
    });
    if (this.elementChart) {
      this.chartBarEvolucao.data.datasets[0].data = this.valoresEvolucao;
      this.chartBarEvolucao.data.labels = this.labelEvolucao;
      this.chartBarEvolucao.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  private animacaoGrafico() {
    const data = [];
    const data2 = [];
    let prev = 100;
    let prev2 = 80;
    for (let i = 0; i < 1000; i++) {
      prev += 5 - Math.random() * 10;
      data.push({ x: i, y: prev });
      prev2 += 5 - Math.random() * 10;
      data2.push({ x: i, y: prev2 });
    }
    const totalDuration = 35000;
    const delayBetweenPoints = totalDuration / data.length;
    const previousY = (ctx:any) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    this.animacao = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx:any) {
          if (ctx.type !== 'data' || ctx.xStarted) {
            return 0;
          }
          ctx.xStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      },
      y: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: previousY,
        delay(ctx:any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };
  }

  delayed: any;
  public gerarGraficoFaturamentoMensal() {
    this.animacaoGrafico();
    this.elementChart = document.getElementById('myChartBarEvolucao');
    this.chartBarEvolucao = new Chart(this.elementChart, {
      type: 'line',
      data: {
        labels: this.labelEvolucao,
        datasets: [{
          label: `Evolução carteira`,
          data: this.valoresEvolucao,
          backgroundColor: 'rgba(46, 54, 175, 0.699)',
          fill: true
        }
        ]
      },
      options: {
        animation: this.animacao,
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

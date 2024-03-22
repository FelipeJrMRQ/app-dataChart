import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { EvolucaoCarteira } from 'src/app/models/carteira/evolucao-carteira';
import { ClienteService } from 'src/app/services/cliente.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import 'moment/locale/pt-br';

@Component({
  selector: 'app-grafico-backlog-comparativo',
  templateUrl: './grafico-backlog-comparativo.component.html',
  styleUrls: ['./grafico-backlog-comparativo.component.css']
})
export class GraficoBacklogComparativoComponent implements OnInit {

  public elementChart: any;
  public chartBarEvolucao: any;
  valoresEvolucaoMes: any = [];
  valoresEvolucaoMesPassado: any = [];
  valoresEvolucaoMesRetrasado: any = [];
  evolucaoCarteira: EvolucaoCarteira[];
  evolucaoCarteiraMesPassado: EvolucaoCarteira[];
  evolucaoCarteiraMesRetrasado: EvolucaoCarteira[];
  data: any = moment().format('yyyy-MM-DD');
  private nomeTela = "dashboard-sintetico";
  animacao: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');

  constructor(
    private clienteService: ClienteService,
    private dateService: DateControllerService,
  
  ) {
    this.evolucaoCarteira = [];
    this.evolucaoCarteiraMesPassado = [];
    this.evolucaoCarteiraMesRetrasado = [];
  }

  ngOnInit(): void {
    this.consultarValorEvolucaoCarteiraAnoAtual();
    this.receberData();
  }

  public receberData(){
    DateControllerService.emitirData.subscribe((res)=>{
      this.dataRecebida = res;
      this.consultarValorEvolucaoCarteiraAnoAtual();
    });
  }

  private consultarValorEvolucaoCarteiraAnoAtual() {
    this.clienteService.consultarEvolucaoCarteira(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida).subscribe({
      next: (res) => {
        this.evolucaoCarteira = res.objeto;
      },
      complete: () => {
        this.consultarValorevolucaoCarteiraMesPassado();
      }
    });
  }

  private consultarValorevolucaoCarteiraMesPassado() {
    let dataInicial  = this.dateService.getInicioDoMes(moment(this.dataRecebida).subtract(1,'month'));
    let dataFinal  = this.dateService.getFimDoMes(moment(this.dataRecebida).subtract(1,'month'));
    this.clienteService.consultarEvolucaoCarteira(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.evolucaoCarteiraMesPassado = res.objeto;
      },
      complete: () => {
        this.consultarValorevolucaoCarteiraMesRetrasado();
      }
    });
  }

  private consultarValorevolucaoCarteiraMesRetrasado() {
    let dataInicial  = this.dateService.getInicioDoMes(moment(this.dataRecebida).subtract(2,'month'));
    let dataFinal  = this.dateService.getFimDoMes(moment(this.dataRecebida).subtract(2,'month'));
    this.clienteService.consultarEvolucaoCarteira(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.evolucaoCarteiraMesRetrasado = res.objeto;
      },
      complete: () => {
        this.atualizaGrafico();
      }
    });
  }

  private limparDadosDoGratico(){
    this.valoresEvolucaoMes = [];
    this.valoresEvolucaoMesPassado = [];
    this.valoresEvolucaoMesRetrasado = [];
  }

  private atualizaGrafico() {
    this.limparDadosDoGratico();
    this.evolucaoCarteira.forEach(e => {
      this.valoresEvolucaoMes.push(e.valor);
    });
    this.evolucaoCarteiraMesPassado.forEach(e => {
      this.valoresEvolucaoMesPassado.push(e.valor);
    });
    this.evolucaoCarteiraMesRetrasado.forEach(e => {
      this.valoresEvolucaoMesRetrasado.push(e.valor);
    });
    if (this.elementChart) {
      this.chartBarEvolucao.data.datasets[0].data = this.valoresEvolucaoMesRetrasado;
      this.chartBarEvolucao.data.datasets[1].data = this.valoresEvolucaoMesPassado;
      this.chartBarEvolucao.data.datasets[2].data = this.valoresEvolucaoMes;
      this.chartBarEvolucao.data.datasets[0].label = `${moment(this.dataRecebida).subtract(2,'month').format('MMM-YY').toUpperCase()}`
      this.chartBarEvolucao.data.datasets[1].label = `${moment(this.dataRecebida).subtract(1,'month').format('MMM-YY').toUpperCase()}`
      this.chartBarEvolucao.data.datasets[2].label = `${moment(this.dataRecebida).format('MMM-YY').toUpperCase()}`
      this.chartBarEvolucao.update();
    } else {
      this.gerarGraficoBacklogMensal();
    }
  }
  delayed: any;
  public gerarGraficoBacklogMensal() {
    this.elementChart = document.getElementById('myChartBacklogComparativo');
    this.chartBarEvolucao = new Chart(this.elementChart, {
      type: 'line',
      data: {
        labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
        datasets: [
          {
            label: `${moment(this.dataRecebida).subtract(2,'month').format('MMM-YY').toUpperCase()}`,
            data: this.valoresEvolucaoMesRetrasado,
            backgroundColor: 'rgba(46, 54, 175, 0.2)',
            borderWidth: 2,
            pointStyle: 'line',
            pointBorderWidth: 0,
            fill: true
          },
          {
            type: 'line',
            label: `${moment(this.dataRecebida).subtract(1,'month').format('MMM-YY').toUpperCase()}`,
            data: this.valoresEvolucaoMesPassado,
            pointStyle: 'line',
            borderColor: 'green',
            borderWidth: 2,
            pointBorderWidth: 0,
            backgroundColor: 'rgb(150, 214, 186, 0.5)',
            fill: true
          },
          {
            type: 'line',
            label: `${moment(this.dataRecebida).format('MMM-YY').toUpperCase()}`,
            data: this.valoresEvolucaoMes,
            borderColor: 'red',
            borderWidth: 2,
            backgroundColor: 'rgb(214, 150, 150, 0.3)',
            pointBorderWidth: 0,
            pointStyle: 'line',
            fill: true
          },
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
    const previousY = (ctx: any) => ctx.index === 0 ? ctx.chart.scales.y.getPixelForValue(100) : ctx.chart.getDatasetMeta(ctx.datasetIndex).data[ctx.index - 1].getProps(['y'], true).y;
    this.animacao = {
      x: {
        type: 'number',
        easing: 'linear',
        duration: delayBetweenPoints,
        from: NaN, // the point is initially skipped
        delay(ctx: any) {
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
        delay(ctx: any) {
          if (ctx.type !== 'data' || ctx.yStarted) {
            return 0;
          }
          ctx.yStarted = true;
          return ctx.index * delayBetweenPoints;
        }
      }
    };
  }
}

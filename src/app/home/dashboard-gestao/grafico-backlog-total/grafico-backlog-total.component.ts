import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { EvolucaoCarteira } from 'src/app/models/carteira/evolucao-carteira';
import { ClienteService } from 'src/app/services/cliente.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-backlog-total',
  templateUrl: './grafico-backlog-total.component.html',
  styleUrls: ['./grafico-backlog-total.component.css']
})
export class GraficoBacklogTotalComponent implements OnInit {

  public elementChart: any;
  public chartBarEvolucao: any;
  valoresDoAno: any = [0,0,0,0,0,0,0,0,0,0,0,0];
  valoresDoAnoPassado: any = [0,0,0,0,0,0,0,0,0,0,0,0];
  evolucaoCarteira: EvolucaoCarteira[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private nomeTela = "dashboard-sintetico";
  animacao: any;
  mediasPorAno: any;
  medias: any = [];

  constructor(
    private clienteService: ClienteService,
    private dateService: DateControllerService
  ) {
    this.evolucaoCarteira = [];
  }

  ngOnInit(): void {
    this.consultarValorEvolucaoCarteira();
    this.receberData();
  }

  private receberData(){
    DateControllerService.emitirData.subscribe((res)=>{
      this.valoresDoAno = [0,0,0,0,0,0,0,0,0,0,0,0];
      this.valoresDoAnoPassado = [0,0,0,0,0,0,0,0,0,0,0,0];
      this.dataRecebida = res;
      this.consultarValorEvolucaoCarteira();
    });
  }

  private consultarValorEvolucaoCarteira() {
    let dataInicial = this.dateService.getInicioDoAno(moment(this.dataRecebida).subtract(1, 'year'));
    console.log(dataInicial);
    this.clienteService.consultarEvolucaoCarteira(dataInicial, this.dataRecebida).subscribe({
      next: (res) => {
        this.evolucaoCarteira = res.objeto;
      },
      complete: () => {
        this.processarDadosCarteira();
      }
    });
  }

  private processarDadosCarteira() {
    this.medias = [];
    let controleMap = new Map<string, { valor: number; contador: number }>();
    for (let e of this.evolucaoCarteira) {
      if (this.apenasDiasUteis(e.data)) {
        let dataFormatada = this.dataFormadata(e.data);
        let valor = controleMap.get(dataFormatada)?.valor || 0;
        let contador = (controleMap.get(dataFormatada)?.contador || 0) + 1;
        controleMap.set(dataFormatada, { valor: valor + e.valor, contador });
      }
    }
    for (let [data, { valor, contador }] of controleMap) {
      let media = valor / contador;
      this.medias.push({ date: data, media });
    }
    this.prepararValores();
  }

  private prepararValores() {
    this.medias.forEach((m: any) => {
      if (moment(this.dataRecebida).year() == moment(m.date).year()) {
        this.valoresDoAno[moment(m.date).month()] = m.media;
      } else {
        this.valoresDoAnoPassado[moment(m.date).month()] = m.media;
      }
    });
    this.atualizaGrafico();
  }

  private apenasDiasUteis(data: any): boolean {
    let dayOfWeek = moment(data).day();
    return dayOfWeek > 0 && dayOfWeek < 6;
  }

  private dataFormadata(data: any): string {
    return moment(data).format('yyyy-MM');
  }

  private atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarEvolucao.data.datasets[0].data = this.valoresDoAno;
      this.chartBarEvolucao.data.datasets[1].data = this.valoresDoAnoPassado;
      this.chartBarEvolucao.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  delayed: any;
  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBacklog');
    this.chartBarEvolucao = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [
          {
            type: 'line',
            label: `2023`,
            data: this.valoresDoAnoPassado,
            pointBackgroundColor: 'black',
            borderColor: 'rgb(46, 54, 175, 0.5)',
            backgroundColor: 'rgba(93, 186, 132, 0.399)',
            fill: true
          },{
          label: `2024`,
          data: this.valoresDoAno,
          backgroundColor: 'rgba(0, 128, 0)',
          // fill: true
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

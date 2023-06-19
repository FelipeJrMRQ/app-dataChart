import { Component, OnInit } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import { Teste } from '../teste';
import { MatDialog } from '@angular/material/dialog';
import { DlgTesteComponent } from '../dlg-teste/dlg-teste.component';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {

  chartLineFatEnt: any;
  chartBarPaticipacao: any;
  delayed: any;
  animacao: any;


  constructor(
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.gerarGraficoLinha();
    this.gerarGraficoParticipacao();
  }

  private animacaoGraficoLinha() {
    const data = [];
    const data2 = [];
    let prev = 100;
    let prev2 = 80;
    for (let i = 0; i < 1000; i++) {
      prev += 5 - Math.random() * 1000;
      data.push({ x: i, y: prev });
      prev2 += 5 - Math.random() * 10;
      data2.push({ x: i, y: prev2 });
    }
    const totalDuration = 95000;
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

  public gerarGraficoLinha() {
    this.animacaoGraficoLinha();
    let elemento: any = document.getElementById('myChartFatEnt');

    this.chartLineFatEnt = new Chart(elemento, {
      type: 'line',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [{
          label: `Entradas`,
          borderColor: 'rgb(0, 128, 0)',
          data: [1, 6, 9, 4, 5, 6, 7, 3, 9, 12, 11, 5],
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          label: `Faturamento`,
          borderColor: 'rgb(2, 78, 218, 250)',
          data: [3, 5, 9, 4, 9, 2, 2, 6, 10, 8, 11, 8],
          backgroundColor: 'rgb(2, 78, 218, 250)',
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

  delayedPart: any;
  public gerarGraficoParticipacao() {
    let chartBarPaticipacao: any = document.getElementById('myChartPart');
    this.chartBarPaticipacao = new Chart(chartBarPaticipacao, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [{
          label: `Participação`,
           data: [1, 2, 3, 1, 2, 1, 2, 0, 2, 4, 3, 1],
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          type: 'bar',
          label: 'Faturamento',
          data: [1, 6, 9, 4, 5, 6, 7, 3, 9, 12, 11, 5],
          backgroundColor: 'rgb(2, 78, 218, 250)',
        },
        ]
      },
      options: {
        animation: {
          duration: 3000,
          onComplete:()=>{
            this.delayedPart = true;
          },
          delay: (context) => {
            let delay = 0;
            if (context.type === 'data' && context.mode === 'default' && !this.delayedPart) {
              delay = context.dataIndex * 300 + context.datasetIndex * 100;
            }
            return delay;
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        }, plugins: {
          legend: {
            fullSize: true,
            labels: {
              color: 'black',
              font: {
                size: 15,
                weight: 'bold'
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

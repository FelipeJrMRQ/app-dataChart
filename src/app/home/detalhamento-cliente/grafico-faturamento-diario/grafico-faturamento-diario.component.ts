import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-grafico-faturamento-diario',
  templateUrl: './grafico-faturamento-diario.component.html',
  styleUrls: ['./grafico-faturamento-diario.component.css']
})
export class GraficoFaturamentoDiarioComponent implements OnInit {

  elementChart: any;
  chartBarDay: any;

  constructor() { }

  ngOnInit(): void {
    this.gerarRelatorio();
  }


  delayed: any;
  public gerarRelatorio(){
    this.elementChart = document.getElementById('myChartBarDia');
    this.chartBarDay = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: [1,2,3,4,5,6,7],
        datasets: [{
          label: `Realizado`,
          data: [10,35,15,25,27,26, 13],
          backgroundColor: 'rgb(0, 128, 0)',
        },
        ]
      },
      options: {
        animation: {
          duration: 4000,
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
            beginAtZero: true
          }
        }, plugins: {
          legend: {
            fullSize: true,
            labels: {
              color: 'black',
              font: {
                size: 13,
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

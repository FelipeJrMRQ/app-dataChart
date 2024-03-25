import { Component, EventEmitter, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { EntradaMensal } from 'src/app/models/entrada/entrada-mensal';
import { EntradaService } from 'src/app/services/entrada.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-entrada-mensal',
  templateUrl: './grafico-entrada-mensal.component.html',
  styleUrls: ['./grafico-entrada-mensal.component.css']
})
export class GraficoEntradaMensalComponent implements OnInit {

  static entradas = new EventEmitter<any>();
  entradasMensais: EntradaMensal[] = [];
  entradasAnoRetrasado: any = [];
  entradasAnoPassado: any = [];
  entradasAno: any = [];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  public elementChart: any;
  public chartBarMonth: any;
  delayed: any;

  constructor(
    private entradaService: EntradaService,
    private dateService: DateControllerService
    
  ) { }

  ngOnInit(): void {
    this.consultarEntradasMensais();
  }

  public consultarEntradasMensais() {
    this.entradaService.consultarEntradaMensal(this.dateService.getInicioDoAno(moment(this.dataRecebida).subtract(2,'year')), this.dataRecebida).subscribe({
      next: (res) => {
        this.entradasMensais = res;
      },
      complete: () => {
        this.prepararDadosParaExibicao();
        this.emitirDados();
      }
    });
  }

  public emitirDados(){
    GraficoEntradaMensalComponent.entradas.emit(this.entradasMensais);
  }

  public prepararDadosParaExibicao() {
    this.entradasMensais.forEach((em) => {
      switch (em.ano) {
        case this.dataMenosDoisAnos(this.dataRecebida):
          this.entradasAnoRetrasado.push(em.valor);
          break;
        case this.dataMenosUmAno(this.dataRecebida):
          this.entradasAnoPassado.push(em.valor);
          break;
        case this.anoAtual(this.dataRecebida):
          this.entradasAno.push(em.valor);
          break;
      }
    });
    this.atualizaGrafico();
  }

  private dataMenosDoisAnos(data: any) {
    return moment(data).subtract(2, 'year').year();
  }

  private dataMenosUmAno(data: any) {
    return moment(data).subtract(1, 'year').year();
  }

  private anoAtual(data: any) {
    return moment(data).year();
  }


  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.entradasAnoRetrasado;
      this.chartBarMonth.data.datasets[0].backgroundColor = 'rgb(77, 77, 77, 0.3)';
      this.chartBarMonth.data.datasets[0].label = `${moment(this.dataRecebida).year() - 2}`;
      this.chartBarMonth.data.datasets[1].data = this.entradasAnoPassado;
      this.chartBarMonth.data.datasets[1].backgroundColor = 'rgb(176, 176, 128)';
      this.chartBarMonth.data.datasets[1].label = `${moment(this.dataRecebida).year() - 1}`;
      this.chartBarMonth.data.datasets[2].data = this.entradasAno;
      this.chartBarMonth.data.datasets[2].backgroundColor = 'rgb(0, 128, 0)';
      this.chartBarMonth.data.datasets[2].label = `${moment(this.dataRecebida).year()}`;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('chartEntradaMensal');
    this.chartBarMonth = new Chart(this.elementChart, {
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [
          {
            type: 'line',
            label: `${moment(this.dataRecebida).year() - 2}`,
            data: this.entradasAnoRetrasado,
            backgroundColor: 'rgb(145, 133, 132, 0.3)',
            fill: true
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year() - 1}`,
            data: this.entradasAnoPassado,
            backgroundColor: 'rgb(176, 176, 128)',
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year()}`,
            data: this.entradasAno,
            backgroundColor: 'rgb(0, 128, 0)',
          },
          // {
          //   type: 'line',
          //   label: '2024-O',
          //   data: [3500000, 8000000, 14000000, 15000000, 20000000, 21000000, 24000000, 26000000, 28000000, 32000000, 36000000, 38000000],
          //   backgroundColor: 'rgb(196, 196, 192, 0.5)',
          //   pointBackgroundColor: 'red',
          //   fill: true
          // },
        ]
      },
      options: {
        animation: {
          duration: 3500,
          onComplete: () => {
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

import { Component, EventEmitter, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { EntradaMensal } from 'src/app/models/entrada/entrada-mensal';
import { EntradaService } from 'src/app/services/entrada.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-entrada-acumulada',
  templateUrl: './grafico-entrada-acumulada.component.html',
  styleUrls: ['./grafico-entrada-acumulada.component.css']
})
export class GraficoEntradaAcumuladaComponent implements OnInit {

  static entradas = new EventEmitter<any>();
  entradasMensais: EntradaMensal[] = [];
  valorAcumuladoDoAnoRetrasado: any = [];
  valorAcumuladoDoAnoPassado: any = [];
  valorAcumuladoDoAno: any = [];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  public elementChart: any;
  public chartBarMonth: any;
  delayed: any;

  constructor(
    private entradaService: EntradaService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.consultarEntradasMensasis();
  }

  public consultarEntradasMensasis(){
    let dataInicial = this.dateService.getInicioDoAno(moment(this.dataRecebida).subtract(2, 'year'));
    this.entradaService.consultarEntradaMensal(dataInicial, this.dataRecebida).subscribe({
      next:(res)=>{
        this.entradasMensais = res;
      },
      complete:()=>{
        this.calculaEntradaAcumulado(dataInicial, this.dataRecebida);
        this.emitirEntradas();
      }
    });
  }

  private emitirEntradas(){
    GraficoEntradaAcumuladaComponent.entradas.emit(this.entradasMensais);
  }

   /**
   * Realiza o cálculo acumulativo do faturamento somando o valor do mês anterior ao mes corrente
   * Exemplo:
   * 
   * o Valor acumulado de março será representado pelo soma do faturamento de (JAN + FEV + MAR)
   * 
   * @param dataInicial 
   * @param dataFinal 
   */
   public calculaEntradaAcumulado(dataInicial: any, dataFinal: any) {
    let totalAnoRetrasado = 0;
    let totalAnoPassado = 0;
    let totalDoAno = 0;
    this.valorAcumuladoDoAno = [];
    this.valorAcumuladoDoAnoPassado = [];
    this.valorAcumuladoDoAnoRetrasado = [];
    this.entradasMensais.forEach(e => {
      if (e.ano == moment(dataInicial).year()) {
        totalAnoRetrasado += e.valor;
        this.valorAcumuladoDoAnoRetrasado.push(totalAnoRetrasado);
      } else if (e.ano > moment(dataInicial).year() && e.ano < moment(dataFinal).year()) {
        totalAnoPassado += e.valor;
        this.valorAcumuladoDoAnoPassado.push(totalAnoPassado);
      } else {
        totalDoAno += e.valor;
        this.valorAcumuladoDoAno.push(totalDoAno);
      }
    });
    this.atualizaGrafico();
  }


  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.valorAcumuladoDoAnoRetrasado;
      this.chartBarMonth.data.datasets[0].backgroundColor = 'rgb(145, 133, 132, 0.7)';
      this.chartBarMonth.data.datasets[0].label = `${moment(this.dataRecebida).year() - 2}`;
      this.chartBarMonth.data.datasets[1].data = this.valorAcumuladoDoAnoPassado;
      this.chartBarMonth.data.datasets[1].backgroundColor = 'rgb(176, 176, 128)';
      this.chartBarMonth.data.datasets[1].label = `${moment(this.dataRecebida).year() - 1}`;
      this.chartBarMonth.data.datasets[2].data = this.valorAcumuladoDoAno;
      this.chartBarMonth.data.datasets[2].backgroundColor = 'rgb(0, 128, 0)';
      this.chartBarMonth.data.datasets[2].label = `${moment(this.dataRecebida).year()}`;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoEvolucaoEntrada();
    }
  }

  public gerarGraficoEvolucaoEntrada() {
    this.elementChart = document.getElementById('chartEvolucaoEntradas');
    this.chartBarMonth = new Chart(this.elementChart, {
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [
          { 
            type: 'bar',
            label: `${moment(this.dataRecebida).year() - 2}`,
            data: this.valorAcumuladoDoAnoRetrasado,
            backgroundColor: 'rgb(145, 133, 132, 0.7)',
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year() - 1}`,
            data: this.valorAcumuladoDoAnoPassado,
            backgroundColor: 'rgb(176, 176, 128)',
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year()}`,
            data: this.valorAcumuladoDoAno,
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

import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { EmissorDadosService } from 'src/app/utils/emissor-dados.service';

@Component({
  selector: 'app-grafico-faturamento-mensal',
  templateUrl: './grafico-faturamento-mensal.component.html',
  styleUrls: ['./grafico-faturamento-mensal.component.css']
})
export class GraficoFaturamentoMensalComponent implements OnInit {

  fatAnoAtual: any = [];
  fatAnoPassado: any = [];
  fatAnoRetrasado: any = [];
  faturamentosMensais: FaturamentoMensal[] = [];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  public elementChart: any;
  public chartBarMonth: any;
  delayed: any;

  constructor(
    private faturamentoService: FaturamentoMensalService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.receberData();
    this.consultarFaturamentoMensal();
  }

  private receberData() {
    DateControllerService.emitirData.subscribe((res) => {
      this.dataRecebida = res;
      this.consultarFaturamentoMensal();
    });
  }

  public consultarFaturamentoMensal() {
    let dataInicial = this.dateService.getInicioDoAno(moment(this.dataRecebida).subtract(2,'years'));
    this.faturamentoService.consultaTotalFaturamentoPorMes(dataInicial, this.dataRecebida).subscribe({
      next: (res) => {
        this.faturamentosMensais = res;
      },
      complete: () => {
        this.limparValoresGrafico();
        this.processarDados();
        this.atualizaGrafico();
        EmissorDadosService.emitirDados.emit(this.faturamentosMensais);
      }
    });
  }

  private processarDados() {
    let anos = [moment(this.dataRecebida).subtract(2, 'year').year(), moment(this.dataRecebida).subtract(1, 'year').year(), moment(this.dataRecebida).year()];
    anos.forEach(ano => {
      let dadosAno: any = this.faturamentosMensais.filter((item: any) => item.ano === ano);
      switch (ano) {
        case moment(this.dataRecebida).year():
          this.preencherValoresDoAnoAtual(dadosAno);
          break;
        case moment(this.dataRecebida).subtract(1, 'year').year():
          this.preencherValoresDoAnoPassado(dadosAno);
          break;
        case moment(this.dataRecebida).subtract(2, 'year').year():
          this.preencherValoresDoAnoRetrasado(dadosAno);
          break;
      }
    });
  }

  private preencherValoresDoAnoAtual(dadosAno: []) {
    dadosAno.forEach((e: any) => {
      this.fatAnoAtual.push(e.valor)
    });
  }

  private preencherValoresDoAnoPassado(dadosAno: []) {
    dadosAno.forEach((e: any) => {
      this.fatAnoPassado.push(e.valor);
    });
  }

  private preencherValoresDoAnoRetrasado(dadosAno: []) {
    dadosAno.forEach((e: any) => {
      this.fatAnoRetrasado.push(e.valor);
    });
  }

  private limparValoresGrafico(){
    this.fatAnoAtual = [];
    this.fatAnoPassado = [];
    this.fatAnoRetrasado = [];
  }

  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.fatAnoRetrasado;
      this.chartBarMonth.data.datasets[0].backgroundColor = 'rgb(77, 77, 77, 0.3)';
      this.chartBarMonth.data.datasets[0].label = `${moment(this.dataRecebida).year() - 2}`;
      this.chartBarMonth.data.datasets[1].data = this.fatAnoPassado;
      this.chartBarMonth.data.datasets[1].backgroundColor = 'rgb(176, 176, 128)';
      this.chartBarMonth.data.datasets[1].label = `${moment(this.dataRecebida).year() - 1}`;
      this.chartBarMonth.data.datasets[2].data = this.fatAnoAtual;
      this.chartBarMonth.data.datasets[2].backgroundColor = 'rgb(0, 128, 0)';
      this.chartBarMonth.data.datasets[2].label = `${moment(this.dataRecebida).year()}`;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartFatMensal');
    this.chartBarMonth = new Chart(this.elementChart, {
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [
          { 
            type: 'line',
            label: `${moment(this.dataRecebida).year() - 2}`,
            data: this.fatAnoRetrasado,
            backgroundColor: 'rgb(145, 133, 132, 0.3)',
            fill: true
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year() - 1}`,
            data: this.fatAnoPassado,
            backgroundColor: 'rgb(176, 176, 128)',
          },
          {
            type: 'bar',
            label: `${moment(this.dataRecebida).year()}`,
            data: this.fatAnoAtual,
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

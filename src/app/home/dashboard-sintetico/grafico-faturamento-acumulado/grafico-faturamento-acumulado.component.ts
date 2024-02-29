import { Component, OnInit } from '@angular/core';
import { BarController, Chart } from 'chart.js';
import * as moment from 'moment';
import { Observable, forkJoin } from 'rxjs';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

Chart.register(BarController)

@Component({
  selector: 'app-grafico-faturamento-acumulado',
  templateUrl: './grafico-faturamento-acumulado.component.html',
  styleUrls: ['./grafico-faturamento-acumulado.component.css']
})
export class GraficoFaturamentoAcumuladoComponent implements OnInit {

  public elementChart: any;
  public chartBarMonth: any;

  valoresDosUltimosTresAnos: any = [];
  metaMes: any = [];
  arrowGap: any;
  FaturamentoAcumuladoAnos: any[] = [];
  faturamentoDoAno: FaturamentoMensal[];
  faturamentoDoAnoPassado: FaturamentoMensal[];
  faturamentoDoAnoRetrasado: FaturamentoMensal[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private nomeTela = "dashboard-sintetico";
  valorAcumuladoDoAno: any = [];
  valorAcumuladoDoPassado: any = [];
  valorAcumuladoDoRetrasado: any = [];

  constructor(
    private faturamentoMensalService: FaturamentoMensalService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.faturamentoDoAno = [];
    this.faturamentoDoAnoPassado = [];
    this.faturamentoDoAnoRetrasado = [];
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
        this.consultarFaturamentoDoAno();
      }
    });
  }

  private consultarFaturamentoDoAno() {
    this.faturamentoDoAno = [];
    this.faturamentoDoAnoPassado = [];
    this.faturamentoDoAnoRetrasado = []
    this.contadorAnos = 0;
    while (this.contadorAnos < 3) {
      let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').subtract(this.contadorAnos, 'year').format('yyyy-MM-DD'));
      let dataFinal = (moment(this.dataRecebida).endOf('year').subtract(this.contadorAnos, 'year').format('yyyy-MM-DD'));
      this.faturamentoMensalService.consultaTotalFaturamentoPorMes(dataInicial, dataFinal).subscribe({
        next: (res) => {
          this.FaturamentoAcumuladoAnos.push(res)
        },
        complete: () => {
          this.calcularFaturamentoAcumuladoDoAno(this.FaturamentoAcumuladoAnos);
        }
      });
      this.contadorAnos++
    }
  }

  public calcularFaturamentoAcumuladoDoAno(listaDeFaturamentoAcumulados: any[]) {
    let contadorCal = 0
    this.valorAcumuladoDoAno = [];
    this.valorAcumuladoDoPassado = [];
    this.valorAcumuladoDoRetrasado = [];

    // desça forma não precisa usar o contador eu acho kk  
    // for(let i = 0; i <  listaDeFaturamentoAcumulados.length;i++ ){
    //     let valor = 0;
    //     listaDeFaturamentoAcumulados[i].forEach((e: any) => {
    //     if (i == 0) {
    //       valor += e.valor;
    //       this.valorAcumuladoDoAno.push(valor);
    //     } else if (i == 1) {
    //       valor += e.valor;
    //       this.valorAcumuladoDoPassado.push(valor);
    //     } else if (i == 2) {
    //       valor += e.valor;
    //       this.valorAcumuladoDoRetrasado.push(valor);
    //     }
    //   });
    // }
    while (contadorCal < 3) {
      let valor = 0;
      listaDeFaturamentoAcumulados[contadorCal].forEach((e: any) => {
        if (contadorCal == 0) {
          valor += e.valor;
          this.valorAcumuladoDoAno.push(valor);
        } else if (contadorCal == 1) {
          valor += e.valor;
          this.valorAcumuladoDoPassado.push(valor);
        } else if (contadorCal == 2) {
          valor += e.valor;
          this.valorAcumuladoDoRetrasado.push(valor);
        }
      });
      contadorCal++
    }
    this.atualizaGrafico();
  }


  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.valorAcumuladoDoRetrasado;
      this.chartBarMonth.data.datasets[0].backgroundColor = 'rgb(77, 77, 77, 0.7)';
      this.chartBarMonth.data.datasets[1].data = this.valorAcumuladoDoPassado;
      this.chartBarMonth.data.datasets[1].backgroundColor = 'rgb(176, 176, 128)';
      this.chartBarMonth.data.datasets[2].data = this.valorAcumuladoDoAno;
      this.chartBarMonth.data.datasets[2].backgroundColor = 'rgb(0, 128, 0)';
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }

  delayed: any;
  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBarAnoAnterior');
    this.chartBarMonth = new Chart(this.elementChart, {
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [
          {
            type: 'bar',
            label: `2022`,
            data: this.valorAcumuladoDoRetrasado,
            backgroundColor: 'rgb(77, 77, 77, 0.7)',
          },
          {
            type: 'bar',
            label: '2023',
            data: this.valorAcumuladoDoPassado,
            backgroundColor: 'rgb(176, 176, 128)',
          },
          {
            type: 'bar',
            label: '2024',
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

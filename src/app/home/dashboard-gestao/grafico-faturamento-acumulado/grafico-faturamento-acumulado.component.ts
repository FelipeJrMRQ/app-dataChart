import { Component, OnInit, Output } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { EmissorDadosService } from 'src/app/utils/emissor-dados.service';

@Component({
  selector: 'app-grafico-faturamento-acumulado',
  templateUrl: './grafico-faturamento-acumulado.component.html',
  styleUrls: ['./grafico-faturamento-acumulado.component.css']
})
export class GraficoFaturamentoAcumuladoComponent implements OnInit {

  public elementChart: any;
  public chartBarMonth: any;
  fatuamentoDosUltimosAnos: FaturamentoMensal[] = [];
  metaMes: any = [];
  arrowGap: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private nomeTela = "dashboard-sintetico";
  valorAcumuladoDoAno: any = [];
  valorAcumuladoDoAnoPassado: any = [];
  valorAcumuladoDoAnoRetrasado: any = [];
  private delayed: any;
  @Output() dadosFatAcumulado: any = 10;

  constructor(
    private faturamentoMensalService: FaturamentoMensalService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {

  }
  ngOnInit(): void {
    this.verificaPermissaoDeAcesso();
    this.receberData();
  }

  private receberData(){
    DateControllerService.emitirData.subscribe((res)=>{
        this.dataRecebida = res;
        this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_faturamento_ano_anterior', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultarFaturamento();
      }
    });
  }
  
  private consultarFaturamento() {
    this.fatuamentoDosUltimosAnos = [];
    let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').subtract(2, 'year').format('yyyy-MM-DD'));
    let dataFinal = (moment(this.dataRecebida).format('yyyy-MM-DD'));
    this.faturamentoMensalService.consultaTotalFaturamentoPorMes(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.fatuamentoDosUltimosAnos = res;
      },
      complete: () => {
        this.calculaFaturamentoAcumulado(dataInicial, dataFinal);
      }
    });
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
  public calculaFaturamentoAcumulado(dataInicial: any, dataFinal: any) {
    let totalAnoRetrasado = 0;
    let totalAnoPassado = 0;
    let totalDoAno = 0;
    this.valorAcumuladoDoAno = [];
    this.valorAcumuladoDoAnoPassado = [];
    this.valorAcumuladoDoAnoRetrasado = [];
    this.fatuamentoDosUltimosAnos.forEach(e => {
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
    this.emitirDados();
  }

  public emitirDados(){
    EmissorDadosService.emitirDados.emit(this.fatuamentoDosUltimosAnos);
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
      this.gerarGraficoFaturamentoMensal();
    }
  }

  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('chartEvolucaoFaturamento');
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

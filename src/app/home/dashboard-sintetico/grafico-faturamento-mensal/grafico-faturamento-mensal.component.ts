import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, LineController } from 'chart.js';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { FaturamentoMensal } from 'src/app/models/faturamento/faturamento-mensal';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

Chart.register(LineController, LinearScale)

@Component({
  selector: 'app-grafico-faturamento-mensal',
  templateUrl: './grafico-faturamento-mensal.component.html',
  styleUrls: ['./grafico-faturamento-mensal.component.css']
})
export class GraficoFaturamentoMensalComponent implements OnInit {
  public elementChart: any;
  public chartBarMonth: any;

  labelAtindigo: any = '';
  labelNaoAtingido: any = 'Atingido';
  labelColor: any = [];
  valor: any = [];
  metaMes: any = [];
  arrowGap: any;
  faturamentoPorMes: FaturamentoMensal[];
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private parametrosMeta: ParametrosMeta[];
  private nomeTela = "dashboard-sintetico";

  constructor(
    private faturamentoMensalService: FaturamentoMensalService,
    private parametrosMetaService: ParametrosMetaService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.faturamentoPorMes = [];
    this.parametrosMeta = [];
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
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_faturamento_mensal', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultarFaturamentoMensal();
      }
    });
  }

  public consultarFaturamentoMensal() {
    this.valor = [];
    this.metaMes = [];
    this.faturamentoMensalService.consultaTotalFaturamentoPorMes(moment(this.dataRecebida).startOf('year').format('yyyy-MM-DD'), this.dataRecebida).subscribe({
      next: (res) => {
        this.faturamentoPorMes = res;
      },
      complete: () => {
        this.valor = [];
        this.faturamentoPorMes.forEach(e => {
          this.valor.push(e.valor);
        });
        this.consultarMeta();
      }
    });
  }

  public consultarMeta() {
    let dataInicial = this.dateService.getInicioDoMes(moment(this.dataRecebida).startOf('year').format('yyyy-MM-DD'));
    let dataFinal = (this.dateService.getInicioDoMes(moment(this.dataRecebida).format('yyyy-MM-DD')));
    this.parametrosMetaService.consultarParamentrosMetaPorPeriodo(dataInicial, dataFinal).subscribe({
      next: (res) => {
        this.parametrosMeta = res;
      },
      complete: () => {
        this.metaMes = [];
        this.parametrosMeta.forEach(p => {
          this.metaMes.push(p.valorMetaMensal);
        })
        this.atualizaGrafico();
      }
    })
  }

  public atualizaGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.valor;
      this.chartBarMonth.data.datasets[1].data = this.metaMes;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }


  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBarMes');
    this.chartBarMonth = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        datasets: [{
          label: 'Realizado',
          data: this.valor,
          backgroundColor: 'green',
        },
        {
          type: 'bar',
          label: 'Meta',
          data: this.metaMes,
          backgroundColor: 'rgb(2, 78, 218)',
        }
        ]
      },
      options: {
        animation: {
          duration: 3500,
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
    this.atualizaGrafico();
  }

}

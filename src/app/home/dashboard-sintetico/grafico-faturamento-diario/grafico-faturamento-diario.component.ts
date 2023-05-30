import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { MetaDiariaService } from 'src/app/services/meta-diaria.service';
import { MetaDiaria } from 'src/app/models/meta-diaria';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-grafico-faturamento-diario',
  templateUrl: './grafico-faturamento-diario.component.html',
  styleUrls: ['./grafico-faturamento-diario.component.css']
})
export class GraficoFaturamentoDiarioComponent implements OnInit {

  public elementChart: any;
  public chartBarDay: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private modeloDeConsulta: ModeloConsulta;
  faturamentoDiario: FaturamentoDiario[];
  metaDiariaDoMes: MetaDiaria[];
  dias: any = [];
  faturamento: any = [];
  metaDia: any = [];
  arrowGap: any;
  private nomeTela = "dashboard-sintetico";

  constructor(
    private faturamentoService: FaturamentoService,
    private dataService: DateControllerService,
    private metaDiariaService: MetaDiariaService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloDeConsulta = new ModeloConsulta();
    this.faturamentoDiario = [];
    this.metaDiariaDoMes = [];
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

  private verificaPermissaoDeAcesso(){
      forkJoin({
        s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_faturamento_diario', this.nomeTela)
      }).subscribe(({s1})=>{
        if(s1){
          this.consultarFaturamentoDiario();
        }
      });
  }

  public consultarFaturamentoDiario() {
    this.faturamentoDiario = [];
    this.faturamentoService.consultaFaturamentoDiario(
      this.modeloDeConsulta.getInstance(
        this.dataService.getInicioDoMes(this.dataRecebida),
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.faturamentoDiario = res.objeto;
      },
      complete: () => {
        this.consultarMetaDiaria();
      }
    });
  }

  private consultarMetaDiaria() {
    this.metaDia = [];
    this.metaDiariaService.consultaMetaDoMes(
      this.dataService.getInicioDoMes(this.dataRecebida),
      moment(this.dataRecebida).format('yyyy-MM-DD')
    ).subscribe({
      next: (res) => {
        this.metaDiariaDoMes = res;
      },
      complete: () => {
        this.criarDadosParaGrafico();
      }
    });
  }

  private criarDadosParaGrafico() {
    this.dias = [];
    this.faturamento = [];
    this.metaDia = [];
    this.faturamentoDiario.forEach(f => {
      this.metaDiariaDoMes.forEach(m => {
        if(m.data == f.data){
          this.metaDia.push(m.valor);
        }
      })
      this.dias.push(moment(f.data).date());
      this.faturamento.push(f.valor);
    });
    this.atualizarGrafico();
  }

  public atualizarGrafico() {
    if (this.elementChart) {
      this.chartBarDay.data.datasets[0].data = this.faturamento.reverse();
      this.chartBarDay.data.datasets[1].data = this.metaDia.reverse();
      this.chartBarDay.data.labels = this.dias.reverse();
      this.chartBarDay.update();
    } else {
      this.gerarGraficoFaturamentoDia();
    }
  }

  delayed: any;
  public gerarGraficoFaturamentoDia() {
    this.elementChart = document.getElementById('myChartBarDia');
    this.chartBarDay = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: this.dias.reverse(),
        datasets: [{
          label: `Realizado`,
          data: this.faturamento.reverse(),
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          type: 'bar',
          label: 'Meta',
          data: this.metaDia.reverse(),
          backgroundColor: 'rgb(2, 78, 218, 250)',
        },
        ]
      },
      options: {
        animation: {
          duration: 3500,
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

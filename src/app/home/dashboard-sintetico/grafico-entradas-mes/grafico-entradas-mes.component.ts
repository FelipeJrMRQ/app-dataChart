import { Component, OnInit } from '@angular/core';
import { BarController, Chart } from 'chart.js';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { EntradaDiaria } from 'src/app/models/entrada/entrada-diaria';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaService } from 'src/app/services/entrada.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ManipuladorArrayService } from 'src/app/utils/manipulador-array.service';
import { read } from 'xlsx';

Chart.register(BarController)

@Component({
  selector: 'app-grafico-entradas-mes',
  templateUrl: './grafico-entradas-mes.component.html',
  styleUrls: ['./grafico-entradas-mes.component.css']
})
export class GraficoEntradasMesComponent implements OnInit {
  public elementChart: any;
  public chartBarFatVsEntr: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  private modeloDeConsulta: ModeloConsulta;
  faturamentoDiario: FaturamentoDiario[];
  entradaDiaria: EntradaDiaria[];
  dias: any = [];
  faturamentos: any = [];
  entradas: any = [];
  metaDia: any = [];
  arrowGap: any;
  novaEntrada: EntradaDiaria[] = []
  private nomeTela = "dashboard-sintetico";

  constructor(
    private faturamentoService: FaturamentoService,
    private manipuladorArrayService: ManipuladorArrayService,
    private dataService: DateControllerService,
    private entradaService: EntradaService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.faturamentoDiario = [];
    this.entradaDiaria = [];
    this.modeloDeConsulta = new ModeloConsulta();
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
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_entrada_vs_faturamento', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
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
        this.consultarEntradas();
      }
    });
  }

  public consultarEntradas() {
    this.entradaService.consultarEntradasPorPeriodo(
      this.modeloDeConsulta.getInstance(
        this.dataService.getInicioDoMes(this.dataRecebida),
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.entradaDiaria = res.objeto;
      },
      complete: () => {
        this.verificarArray();
      }
    });
  }

  public verificarArray() {
    if (this.entradaDiaria.length > this.faturamentoDiario.length) {
      this.faturamentoDiario = this.verificarDifenreçaDeAtributoDataEntreLista(this.entradaDiaria, this.faturamentoDiario);
    } if (this.faturamentoDiario.length > this.entradaDiaria.length) {
      this.entradaDiaria = this.verificarDifenreçaDeAtributoDataEntreLista(this.faturamentoDiario, this.entradaDiaria)
    }
    this.entradaDiaria = this.manipuladorArrayService.ordernarArrayPorData(this.entradaDiaria);
    this.faturamentoDiario = this.manipuladorArrayService.ordernarArrayPorData(this.faturamentoDiario);
    this.organizaValoresParaOGrafico();
  }

  /**
   * Dentro da função de filtro, estamos usando some no array this.faturamentoDiario.
   * O método some verifica se pelo menos um elemento no array satisfaz a condição especificada.
   * Estamos verificando se não há nenhum faturamento cuja data corresponda à data da entrada atual.
   * Se nenhum faturamento tiver a mesma data da entrada, isso significa que é uma data diferente e,portanto, retornamos true, caso contrário,retornamos false.
  **/
  private verificarDifenreçaDeAtributoDataEntreLista(lista: any, lista2: any) {
    let diferença = lista.filter((entrada: any) => !lista2.some((valor: any) => valor.data === entrada.data));
    diferença.forEach((v: any) => {
      lista2.push({
        id: v.id,
        data: v.data,
        valor: 0,
      });
    });
    return lista2;
  }

  private calcularValoresGraficos(lista: any, listaData?: any[]) {
    let listaValores: any[] = [];
    lista.forEach((e: any) => {
      listaValores.push(e.valor);
      listaData?.push(moment(e.data).date());
    });
    return listaValores;
  }

  public organizaValoresParaOGrafico() {
    this.faturamentos = [];
    this.dias = [];
    this.faturamentos = this.calcularValoresGraficos(this.faturamentoDiario, this.dias);
    this.entradas = this.calcularValoresGraficos(this.entradaDiaria);
    this.atualizarGrafico();
  }

  public atualizarGrafico() {
    if (this.elementChart) {
      this.chartBarFatVsEntr.data.datasets[0].data = this.entradas.reverse();
      this.chartBarFatVsEntr.data.datasets[1].data = this.faturamentos.reverse();
      this.chartBarFatVsEntr.data.labels = this.dias.reverse();
      this.chartBarFatVsEntr.update();
    } else {
      this.gerarGraficoFaturamentoVsEntrada();
    }
  }

  delayed: any;
  public gerarGraficoFaturamentoVsEntrada() {
    this.elementChart = document.getElementById('myChartBarEntradaVsFaturamento');
    this.chartBarFatVsEntr = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: this.dias.reverse(),
        datasets: [{
          label: `Entradas`,
          data: this.entradas.reverse(),
          backgroundColor: 'rgb(0, 128, 0)',
        },
        {
          type: 'bar',
          label: 'Faturamento',
          data: this.faturamentos.reverse(),
          backgroundColor: 'rgb(2, 78, 218, 250)',
        },
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
            beginAtZero: true
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

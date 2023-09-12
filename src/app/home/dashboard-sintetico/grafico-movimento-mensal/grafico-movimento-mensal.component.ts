import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { MovimentoProdutoMensalDTO } from 'src/app/models/produto/movimento-produto-mensal-dto';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-grafico-movimento-mensal',
  templateUrl: './grafico-movimento-mensal.component.html',
  styleUrls: ['./grafico-movimento-mensal.component.css']
})
export class GraficoMovimentoMensalComponent implements OnInit {

  public elementChart: any;
  public chartBarNovosItens: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  delayed: any;
  movimentos: MovimentoProdutoMensalDTO[] = [];
  labes: any = [];
  quantidades: any = [];
  private nomeTela: any = 'dashboard-sintetico';
  controle: any = false;
  private dataInicial= moment().format('yyyy-MM-DD');
  private dataFinal = moment().format('yyyy-MM-DD');

  constructor(
    private produtoService: ProdutoService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_movimentacao_produto', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.controle = s1;
        this.subtrairDataFinal();
      }
    });
  }

  /**
  * Com base na data atual este método decrementa a quantidade de meses passada por parametro
  * Esta data obtida será utilizada como base na consulta de movimentação
  * @param meses 
  */
  public subtrairDataFinal() {
    let diasDoMes = moment().daysInMonth();
    this.dataFinal = moment().subtract(diasDoMes+1, 'days').format('yyyy-MM-DD');
    this.dataInicial = this.dateService.getInicioDoAno(this.dataInicial);
    this.consultarMovimentacaoDeProdutosMensal();
  }

  private consultarMovimentacaoDeProdutosMensal() {
    this.produtoService.consultarMovimentoProdutoMensal(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.movimentos = res;
        this.prepararItensParaExbicao();
      }
    });
  }

  private prepararItensParaExbicao() {
    this.quantidades = [];
    this.labes = [];
    this.movimentos.forEach(e => {
      this.quantidades.push(e.quantidade);
      this.labes.push(`${moment().month(e.mes - 1).format('MM')}-${moment().year(e.ano).format('YY')}`);
    });
    this.gerarGrafico();
  }


  private gerarGrafico() {
    this.elementChart = document.getElementById('myChartBarMovimentoMensal');
    this.chartBarNovosItens = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        //labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
        labels: this.labes,
        datasets: [{
          label: 'Quantidade',
          data: this.quantidades,
          backgroundColor: 'rgba(46, 54, 175, 0.699)',
          //fill: true,
        }
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

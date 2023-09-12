import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { MovimentoCliente } from 'src/app/models/movimentoCliente';
import { ProdutoService } from 'src/app/services/produto.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-grafico-movimentacao-produtos',
  templateUrl: './grafico-movimentacao-produtos.component.html',
  styleUrls: ['./grafico-movimentacao-produtos.component.css']
})
export class GraficoItensNaoRetornadosComponent implements OnInit {

  public elementChart: any;
  public chartBarMonth: any;
  delayed: any;
  movimentoCliente: MovimentoCliente[] = [];
  quantidade: any[] = []
  nome: any[] = []
  cores: any = []
  dataAtual = moment().format("yyyy-MM-DD")
  dataFinal = moment().subtract(1, 'month').format("yyyy-MM-DD");
  valorMes: any = 1;
  private nomeTela = "dashboard-sintetico";
  controle = false;

  constructor(
    private produtoService: ProdutoService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {

  }

  ngOnInit(): void {
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_movimentacao_produto', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.controle = s1;
        this.subtrairDataFinal(this.valorMes);
        this.atualizaMovimento();
      }
    });
  }

  public atualizaMovimento() {
    ProdutoService.movimentoProdutos.subscribe((res) => {
      this.subtrairDataFinal(res);
    });
  }

  public subtrairDataFinal(meses: number) {
    this.dataFinal = moment().subtract(meses,'months').format("yyyy-MM-DD");
    this.consultaMovimentoProdutos();
  }

  public consultaMovimentoProdutos() {
    this.produtoService.consultarMovimentoProduto(this.dateService.getInicioDoMes(this.dataFinal), this.dataFinal).subscribe({
      next: (res) => {
        this.movimentoCliente = res
      },
      complete: () => {
        this.quantidade = [];
        this.nome = [];
        this.movimentoCliente.forEach(f => {
          if (this.quantidade.length < 10) {
            this.quantidade.push(f.quantidade)
            this.nome.push(f.nomeCliente)
          }
        });
        this.RandomColor()
        this.atualizarGrafico();
      }
    });
  }

  public RandomColor() {
    for (let i = 0; i < this.nome.length; i++) {
      this.cores.push(this.RandomRGBColor())
    }

  }
  public RandomRGBColor(): string {
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }

  public atualizarGrafico() {
    if (this.elementChart) {
      this.chartBarMonth.data.datasets[0].data = this.quantidade;
      this.chartBarMonth.data.labels = this.nome;
      this.chartBarMonth.update();
    } else {
      this.gerarGraficoFaturamentoMensal();
    }
  }


  public gerarGraficoFaturamentoMensal() {
    this.elementChart = document.getElementById('myChartBarPie');
    this.chartBarMonth = new Chart(this.elementChart, {
      type: 'pie',
      data: {
        labels: this.nome,
        datasets: [{
          data: this.quantidade,
          backgroundColor: this.cores,
        },
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
            position: 'bottom',
            labels: {
              color: 'black',
              font: {
                size: 0,
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

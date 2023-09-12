import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { IncidenciaNovosNegocioDTO } from 'src/app/models/incidencia-novos-negocios-dto';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-grafico-novos-itens',
  templateUrl: './grafico-novos-itens.component.html',
  styleUrls: ['./grafico-novos-itens.component.css']
})
export class GraficoNovosItensComponent implements OnInit {
  
  public elementChart: any;
  public chartBarNovosItens: any;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  delayed: any;
  meses: any = [];
  quantidades: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  novosItens: IncidenciaNovosNegocioDTO[] = [];
  private nomeTela: any = 'dashboard-sintetico';
  controle: any = false;

  constructor(
    private produtoService: ProdutoService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    FaturamentoService.emitirData.subscribe(res=>{
      this.dataRecebida = res;
      this.verificaPermissaoDeAcesso();
    });
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso(){
      forkJoin({  
        s1: this.controleExibicaoService.verificaPermissaoDeAcesso('grafico_novos_negocios', this.nomeTela)
      }).subscribe(({s1})=>{
        if(s1){
          this.controle = true;
          this.consultarIncidenciaDeNovosNegocios();
        }
      });
  }

  private consultarIncidenciaDeNovosNegocios() {
    this.produtoService.consultaIncidenciaNovosNegocios(this.dateService.getInicioDoAno(this.dataRecebida), this.dataRecebida).subscribe({
      next: (res) => {
        this.novosItens = res;
      },
      complete:()=>{
        this.prepararItensParaExbicao();
      }
    });
  }

  private prepararItensParaExbicao() {
    this.quantidades = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.novosItens.forEach(e => {
      switch (e.mes) {
        case 1:
          this.quantidades[0] = e.quantidade;
          break;
        case 2:
          this.quantidades[1] = e.quantidade;
          break;
        case 3:
          this.quantidades[2] = e.quantidade;
          break;
        case 4:
          this.quantidades[3] = e.quantidade;
          break;
        case 5:
          this.quantidades[4] = e.quantidade;
          break;
        case 6:
          this.quantidades[5] = e.quantidade;
          break;
        case 7:
          this.quantidades[6] = e.quantidade;
          break;
        case 8:
          this.quantidades[7] = e.quantidade;
          break;
        case 9:
          this.quantidades[8] = e.quantidade;
          break;
        case 10:
          this.quantidades[9] = e.quantidade;
          break;
        case 11:
          this.quantidades[10] = e.quantidade;
          break;
        case 12:
          this.quantidades[11] = e.quantidade;
          break;
        default:
          break;
      }
    });
    this.atualizarGrafico();
  }

  private atualizarGrafico() {
    if (this.elementChart) {
      this.chartBarNovosItens.data.datasets[0].data = this.quantidades;
      this.chartBarNovosItens.update();
    } else {
      this.gerarGrafico();
    }
  }

  private gerarGrafico() {
    this.elementChart = document.getElementById('myChartBarNovosItens');
    this.chartBarNovosItens = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'],
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

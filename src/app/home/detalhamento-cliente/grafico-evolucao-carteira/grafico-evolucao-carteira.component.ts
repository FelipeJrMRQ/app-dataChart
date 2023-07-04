import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { FaturamentoDiarioDTO } from 'src/app/models/detalhamento-cliente/faturamento-diario-dto';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';

@Component({
  selector: 'app-grafico-evolucao-carteira',
  templateUrl: './grafico-evolucao-carteira.component.html',
  styleUrls: ['./grafico-evolucao-carteira.component.css']
})
export class GraficoEvolucaoCarteiraComponent implements OnInit {

  private datas: any = [];
  private valores: any = [];
  private cdCliente: any;
  private dataRecebida: any;
  elementChart: any;
  chartBarDay: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private datalhamentoService: DetalhamentoClienteService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.dataRecebida = res.data;
      this.cdCliente = res.cdCliente;
      this.consultaEvolucaoCarteiraDoCliente();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res;
      this.consultaEvolucaoCarteiraDoCliente();
    });
  }

  private consultaEvolucaoCarteiraDoCliente() {
    this.datalhamentoService.consultarEvolucaoCarteiraCliente(moment(this.dataRecebida).subtract(2, 'months').format('yyyy-MM-DD'), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.organizarDadosParaExibicao(res);
      },
    });
  }

  private organizarDadosParaExibicao(dadosCarteira: FaturamentoDiarioDTO[]) {
    this.valores = [];
    this.datas = [];
    dadosCarteira.forEach(e => {
      this.valores.push(e.valor);
      this.datas.push(moment(e.data).format('DD-MM'));
    });
    this.atualizaValoresDoGrafico();
  }

  public atualizaValoresDoGrafico(){
    if(this.elementChart){
      this.chartBarDay.data.labels = this.datas;
      this.chartBarDay.data.datasets[0].data = this.valores;
      this.chartBarDay.update();
    }else{
      this.gerarRelatorio();
    }
  }

  delayed: any;
  public gerarRelatorio() {
    this.elementChart = document.getElementById('myChartBarEvolucao');
    this.chartBarDay = new Chart(this.elementChart, {
      type: 'line',
      data: {
        labels: this.datas,
        datasets: [{
          label: `Realizado`,
          data: this.valores,
          backgroundColor: 'rgba(46, 54, 175, 0.699)',
          fill: true
        },
        ]
      },
      options: {
        animation:{
          duration: 3500
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import { FaturamentoMensalDTO } from 'src/app/models/detalhamento-cliente/faturamento-mensal-dto';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-faturamento-mensal',
  templateUrl: './grafico-faturamento-mensal.component.html',
  styleUrls: ['./grafico-faturamento-mensal.component.css']
})
export class GraficoFaturamentoMensalComponent implements OnInit {

  private elementChart: any;
  private chartBarDay: any;
  private dadosFaturamento: any = [];
  private dataRecebida: any;
  private cdCliente: any;
  private valores: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  private meses: any = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];


  constructor(
    private detalhamentoClienteService: DetalhamentoClienteService,
    private dateService: DateControllerService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.dataRecebida = res.data;
      this.cdCliente = res.cdCliente;
      this.consultarFaturamentoMensal();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res;
      this.consultarFaturamentoMensal();
    });
  }

  public consultarFaturamentoMensal() {
    this.detalhamentoClienteService.consultarFaturamentoMensalDoCliente(this.dateService.getInicioDoAno(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.organizarValoresParaExibicao(res);
      }
    });
  }

  private organizarValoresParaExibicao(valores: FaturamentoMensalDTO[]) {
    this.valores = [];
    valores.forEach(e => {
      switch (e.mes) {
        case 1:
          this.valores[0] = e.valor;
          break;
        case 2:
          this.valores[1] = e.valor;
          break;
        case 3:
          this.valores[2] = e.valor;
          break;
        case 4:
          this.valores[3] = e.valor;
          break;
        case 5:
          this.valores[4] = e.valor;
          break;
        case 6:
          this.valores[5] = e.valor;
          break;
        case 7:
          this.valores[6] = e.valor;
          break;
        case 8:
          this.valores[7] = e.valor;
          break;
        case 9:
          this.valores[8] = e.valor;
          break;
        case 10:
          this.valores[9] = e.valor;
          break;
        case 11:
          this.valores[10] = e.valor
          break;;
        case 12:
          this.valores[11] = e.valor
          break;
      }
    });
    this.atualizarGrafico();
  }

  private atualizarGrafico(){
    if(this.elementChart){
      this.chartBarDay.data.labels = this.meses;
      this.chartBarDay.data.datasets[0].data = this.valores;
      this.chartBarDay.update();
    }else{
      this.gerarGrafico();
    }
  }

  delayed: any;
  public gerarGrafico() {
    this.elementChart = document.getElementById('myChartBarFatMensal');
    this.chartBarDay = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: this.meses ,
        datasets: [{
          label: `Faturamento Mensal`,
          data: this.valores,
          backgroundColor: 'rgba(17, 116, 168, 0.800)',
        },
        ]
      },
      options: {
        animation: {
          duration: 4000,
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
          x: {
            stacked: true,
          },
          y: {
            stacked: true
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { EntradaDoDiaDTO } from 'src/app/models/detalhamento-cliente/entrada-dia-dto';
import { FaturamentoDiarioDTO } from 'src/app/models/detalhamento-cliente/faturamento-diario-dto';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { ExcelService } from 'src/app/services/excel.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-grafico-faturamento-diario',
  templateUrl: './grafico-faturamento-diario.component.html',
  styleUrls: ['./grafico-faturamento-diario.component.css']
})
export class GraficoFaturamentoDiarioComponent implements OnInit {

  elementChart: any;
  chartBarDay: any;
  dataRecebida: any;
  cdCliente: any;
  nomeCliente: any;
  faturamentos: FaturamentoDiarioDTO[];
  entradadas: EntradaDoDiaDTO[];
  valoresFaturamento: any = [];
  datasFaturamento: any = [];

  private modelo: ModeloConsulta;

  constructor(
    private detalhamentoService: DetalhamentoClienteService,
    private dataService: DateControllerService,
    private activeRoute: ActivatedRoute,
    private exportService: ExcelService,
  ) {
    this.modelo = new ModeloConsulta();
    this.faturamentos = [];
    this.entradadas = [];
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res:any)=>{
      this.dataRecebida = res.data;
      this.cdCliente = res.cdCliente;
      this.nomeCliente= res.nomeCliente;
      this.consultaFaturamentoDiarioDoCliente();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res;
      this.consultaFaturamentoDiarioDoCliente();
    });
  }

  private consultaFaturamentoDiarioDoCliente(){
    this.detalhamentoService.consultarFaturamentoDiarioDoCliente(this.dataService.getInicioDoMes(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next:(res)=>{
        this.faturamentos = res;
      },
      complete:()=>{
        this.organizarValoresFaturamentoParaExibicao();
      }
    });
  }

  private organizarValoresFaturamentoParaExibicao(){
    this.valoresFaturamento = [];
    this.datasFaturamento = [];
    this.faturamentos.forEach(e=>{
      this.valoresFaturamento.push(e.valor);
      this.datasFaturamento.push(moment(e.data).date())
    });
    this.atualizarGrafico();
  }

  public atualizarGrafico(){
    if(this.elementChart){
      this.chartBarDay.data.labels = this.datasFaturamento;
      this.chartBarDay.data.datasets[0].data = this.valoresFaturamento;
      this.chartBarDay.update();
    }else{
      this.gerarGrafico();
    }
  }

  delayed: any;
  public gerarGrafico() {
    this.elementChart = document.getElementById('myChartBarDia');
    this.chartBarDay = new Chart(this.elementChart, {
      type: 'bar',
      data: {
        labels: this.datasFaturamento,
        datasets: [{
          label: `Faturamento diário`,
          data: this.valoresFaturamento,
          backgroundColor: 'rgba(0, 128, 0, 0.800)',
        },
        ]
      },
      options: {
        animation: {
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

  public exportarDados(){
    this.exportService.geradorExcell(this.faturamentos, `faturamento_diario`);
  }

}

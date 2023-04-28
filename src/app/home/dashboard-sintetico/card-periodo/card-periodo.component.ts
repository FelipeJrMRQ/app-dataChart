import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-card-periodo',
  templateUrl: './card-periodo.component.html',
  styleUrls: ['./card-periodo.component.css']
})
export class CardPeriodoComponent implements OnInit {

  diasTrabalhados: number = 0;
  diasUteisRestantes: number = 0;
  sabadosRestantes: number = 0;
  dataRecebida: any = moment().format('yyyy-MM-DD');

  constructor(
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.receberDataEscolhida();
    this.calculaDiasUteisParaFimDoMes();
  }

  public receberDataEscolhida() {
    FaturamentoService.emitirData.subscribe((res: any) => {
      this.dataRecebida = res;
      this.calculaDiasUteisParaFimDoMes();
    });
  }

  public calculaDiasUteisParaFimDoMes() {
    this.dateService.calculaDiasUteisParaFimDoMes(this.dataRecebida).subscribe({
      next: (res) => {
        this.diasUteisRestantes = res;
      },
      complete: () => {
        this.calculaDiasTrabalhados();
      }
    });
  }

  public calculaDiasTrabalhados() {
    this.dateService.calculaDiasTrabalhados(this.dataRecebida).subscribe({
      next: (res) => {
        this.diasTrabalhados = res;
      },
      complete: () => {
          this.calcularSabadosParaFimDoMes();
      }
    });
  }

  public calcularSabadosParaFimDoMes() {
    this.sabadosRestantes = this.dateService.calculaSabadoDoMes(this.dataRecebida);
  }

}

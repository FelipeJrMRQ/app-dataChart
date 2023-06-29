import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoDiarioDTO } from 'src/app/models/detalhamento-cliente/faturamento-diario-dto';
import { FaturamentoMensalDTO } from 'src/app/models/detalhamento-cliente/faturamento-mensal-dto';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-card-faturamento',
  templateUrl: './card-faturamento.component.html',
  styleUrls: ['./card-faturamento.component.css']
})
export class CardFaturamentoComponent implements OnInit {

  faturamentoDia: number = 0;
  faturamentoMes: number = 0;
  faturamentoAno: number = 0;
  dataInicial: any;
  dataFinal: any;
  cdCliente: any;

  constructor(
    private detalhamentoService: DetalhamentoClienteService,
    private activeRoute: ActivatedRoute,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.dataInicial = res.data;
      this.dataFinal = res.data
      this.consultaFaturamentoDoDia();
      this.consultarFaturamentoDoMes();
      this.consultarFaturamentoDoAno();
    });
  }

  public consultaFaturamentoDoDia() {
    this.detalhamentoService.consultarFaturamentoDiarioDoCliente(this.dataInicial, this.dataFinal, this.cdCliente).subscribe({
      next: (res) => {
        this.faturamentoDia = res[0].valor;
      }
    });
  }

  public consultarFaturamentoDoMes() {
    this.detalhamentoService.consultarFaturamentoMensalDoCliente(
        this.dateService.getInicioDoMes(this.dataInicial),
       this.dataFinal,
        this.cdCliente)
      .subscribe({
        next: (res) => {
          this.faturamentoMes = res[0].valor;
        }
      });
  }

  public consultarFaturamentoDoAno() {
    this.detalhamentoService.consultarFaturamentoMensalDoCliente(
        this.dateService.getInicioDoAno(this.dataInicial),
       this.dataFinal,
        this.cdCliente)
      .subscribe({
        next: (res) => {
          this.somaFaturamentoDoAno(res);
        }
      });
  }

  private somaFaturamentoDoAno(faturamentosDoMes: FaturamentoMensalDTO[]){
    this.faturamentoAno = 0;
    faturamentosDoMes.forEach(e=>{
      this.faturamentoAno +=e.valor;
    });
  }

}

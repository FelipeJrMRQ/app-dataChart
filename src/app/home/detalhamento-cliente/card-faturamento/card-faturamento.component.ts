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
  dataRecebida: any;
  cdCliente: any;

  constructor(
    private detalhamentoService: DetalhamentoClienteService,
    private activeRoute: ActivatedRoute,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.consultaFaturamentoDoDia();
      this.consultarFaturamentoDoMes();
      this.consultarFaturamentoDoAno();
    });
    this.receberDataPorEvento();
  }

  
  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res
      this.consultaFaturamentoDoDia();
      this.consultarFaturamentoDoMes();
      this.consultarFaturamentoDoAno();
    });
  }

  public consultaFaturamentoDoDia() {
    this.detalhamentoService.consultarFaturamentoDiarioDoCliente(this.dataRecebida, this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        try {
          this.faturamentoDia = res[0].valor;
        } catch (error) {
          
        }
      }
    });
  }

  public consultarFaturamentoDoMes() {
    this.detalhamentoService.consultarFaturamentoMensalDoCliente(
        this.dateService.getInicioDoMes(this.dataRecebida),
       this.dataRecebida,
        this.cdCliente)
      .subscribe({
        next: (res) => {
          try {
            this.faturamentoMes = res[0].valor;
          } catch (error) {}
        }
      });
  }

  public consultarFaturamentoDoAno() {
    this.detalhamentoService.consultarFaturamentoMensalDoCliente(
        this.dateService.getInicioDoAno(this.dataRecebida),
       this.dataRecebida,
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
      try {
        this.faturamentoAno +=e.valor;
      } catch (error) {}
    });
  }

}

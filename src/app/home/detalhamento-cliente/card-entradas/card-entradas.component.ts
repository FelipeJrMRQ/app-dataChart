import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ActivatedRoute } from '@angular/router';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';

@Component({
  selector: 'app-card-entradas',
  templateUrl: './card-entradas.component.html',
  styleUrls: ['./card-entradas.component.css']
})
export class CardEntradasComponent implements OnInit {

  vlEntradaDia: any = 0;
  vlEntradaMes: any = 0;
  vlEntradaAno: any = 0;
  private cdCliente: any;
  private dataRecebida: any;
  private nomeCliente: any;


  constructor(
    private datalhamentoService: DetalhamentoClienteService,
    private dataService: DateControllerService,
    private activeRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.limparDados();
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.nomeCliente = res.nomeCliente;
      this.dataRecebida = res.data;
      this.consultarEntradasDoMes();
      this.consultarEntradasDoAno();
      this.consultaEntradaDiaria();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res
      this.consultarEntradasDoMes();
      this.consultarEntradasDoAno();
      this.consultaEntradaDiaria();
    });
  }

  public limparDados(){
    this.vlEntradaDia  = 0;
    this.vlEntradaMes  = 0;
    this.vlEntradaAno  = 0;
  }

  public consultaEntradaDiaria(){
    this.limparDados();
      this.datalhamentoService.consultaEntradaDoDiaDoCliente(this.dataRecebida, this.dataRecebida, this.cdCliente).subscribe({
          next:(res)=>{
            try {
              this.vlEntradaDia = res[0].valor;
            } catch (error) {}
          }
      });
  } 

  public consultarEntradasDoMes() {
    this.limparDados()
    this.datalhamentoService.consultaEntradaDoMesDoCliente(this.dataService.getInicioDoMes(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.vlEntradaMes = res[0].valor;
      }
    });
  }

  public consultarEntradasDoAno() {
    this.limparDados();
    this.datalhamentoService.consultaEntradaDoMesDoCliente(this.dataService.getInicioDoAno(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        res.forEach(e => {
          this.vlEntradaAno += e.valor;
        });
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-card-medias',
  templateUrl: './card-medias.component.html',
  styleUrls: ['./card-medias.component.css']
})
export class CardMediasComponent implements OnInit {

  private cdCliente: any;
  private dataRecebida: any;
  valorMediaEntrada: any = 0;
  valorMediaFaturamento: any = 0;

  constructor(
    private detalhamentoService: DetalhamentoClienteService,
    private dateService: DateControllerService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.dataRecebida = res.data;
      this.consultarEntradaDiaria();
      this.consultarFaturamentoDiario();
    });
  }

  private consultarFaturamentoDiario() {
    this.detalhamentoService.consultarFaturamentoMensalDoCliente(this.dateService.getInicioDoAno(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.valorMediaFaturamento = this.calculaMediaFaturamento(res);
      }
    });
  }

  private consultarEntradaDiaria() {
    this.detalhamentoService.consultaEntradaDoMesDoCliente(this.dateService.getInicioDoAno(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.valorMediaEntrada = this.calculaMediaEntrada(res);
      }
    });
  }

  private calculaMediaEntrada(dados: any) {
    let total = 0;
    let itens = dados.length;
    dados.forEach((e: any) => {
      total += e.valor;
    });
    return (total / itens);
  }

  private calculaMediaFaturamento(dados: any) {
    let total = 0;
    let itens = dados.length;
    dados.forEach((e: any) => {
      total += e.valor;
    });
    return (total / itens);
  }

}

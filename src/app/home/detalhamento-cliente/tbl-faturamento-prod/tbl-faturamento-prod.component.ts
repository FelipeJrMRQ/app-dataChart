import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaturamentoMensalBeneficiamento } from 'src/app/models/faturamento/faturamento-mensal-beneficiamento';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-tbl-faturamento-prod',
  templateUrl: './tbl-faturamento-prod.component.html',
  styleUrls: ['./tbl-faturamento-prod.component.css']
})
export class TblFaturamentoProdComponent implements OnInit {

  valorTotal: any = 0;
  itensPagina: any = 10;
  pagina: any = 1;
  private cdCliente: any;
  private dataRecebida: any;
  faturamentos: FaturamentoMensalProduto[] = [];

  constructor(
    private faturamentoService: FaturamentoMensalService,
    private activeRoute: ActivatedRoute,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.dataRecebida = res.data;
      this.consultarFaturamentoDoClientePorProduto();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res;
      this.consultarFaturamentoDoClientePorProduto();
    });
  }

  public consultarFaturamentoDoClientePorProduto() {
    this.faturamentoService.detalhesDoClientePorProduto(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.faturamentos = res;
      },
      complete:()=>{
        this.calculaTotalFaturamento();
      }
    });
  }

  private calculaTotalFaturamento(){
    this.valorTotal = 0;
    this.faturamentos.forEach(e=>{
        this.valorTotal += e.valor;
    })
  }

}

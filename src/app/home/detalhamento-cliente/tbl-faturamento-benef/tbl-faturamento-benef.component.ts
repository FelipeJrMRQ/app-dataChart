import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaturamentoMensalBeneficiamento } from 'src/app/models/faturamento/faturamento-mensal-beneficiamento';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-tbl-faturamento-benef',
  templateUrl: './tbl-faturamento-benef.component.html',
  styleUrls: ['./tbl-faturamento-benef.component.css']
})
export class TblFaturamentoBenefComponent implements OnInit {

  valorTotal: any = 0;
  itensPagina: any = 10;
  pagina: any = 1;
  private cdCliente: any;
  private dataRecebida: any;
  faturamentos: FaturamentoMensalBeneficiamento[] = [];

  constructor(
    private faturamentoService: FaturamentoMensalService,
    private activeRoute: ActivatedRoute,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any)=>{
        this.cdCliente = res.cdCliente;
        this.dataRecebida = res.data;
        this.consultarFaturamentoDoClientePorBeneficiamento();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res;
      this.consultarFaturamentoDoClientePorBeneficiamento();
    });
  }

  public consultarFaturamentoDoClientePorBeneficiamento(){
      this.faturamentoService.detalhesDoClientePorBeneficiamento(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida, this.cdCliente).subscribe({
          next:(res)=>{
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

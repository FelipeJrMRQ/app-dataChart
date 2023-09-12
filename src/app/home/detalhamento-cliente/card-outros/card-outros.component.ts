import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-card-outros',
  templateUrl: './card-outros.component.html',
  styleUrls: ['./card-outros.component.css']
})
export class CardOutrosComponent implements OnInit {

  cdCliente: any;
  dataRecebida: any;
  valorCarteira: any = 0;
  nomeCliente: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private detalhamentoService: DetalhamentoClienteService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
 
    this.activeRoute.params.subscribe((res: any) => {
      this.cdCliente = res.cdCliente;
      this.nomeCliente = res.nomeCliente;
      this.dataRecebida = res.data;
      this.consultaCarteiraDoCliente();
    });
    this.receberDataPorEvento();
  }

  public limparDados(){
    this.valorCarteira = 0;
  }

  private receberDataPorEvento() {
    DetalhamentoClienteService.event.subscribe(res => {
      this.dataRecebida = res
      this.consultaCarteiraDoCliente();
    });
  }

  public consultaCarteiraDoCliente() {
    this.limparDados();
    this.detalhamentoService.consultaCarteiraDoCliente(this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
       try {
        this.valorCarteira = res[0].valor;
       } catch (error) {
        
       }
      }
    });
  }


  public navegarPerspectivaAnual() {
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }

  public exibirHistoricoAnualPorProduto() {
    this.router.navigate([`entrada-extrato-anual/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`]);
  }

}

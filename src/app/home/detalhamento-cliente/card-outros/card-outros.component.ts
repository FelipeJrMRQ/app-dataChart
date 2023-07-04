import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private activeRoute: ActivatedRoute,
    private detalhamentoService: DetalhamentoClienteService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res:any)=>{
       this.cdCliente = res.cdCliente; 
       this.dataRecebida = res.data;
       this.consultaCarteiraDoCliente();
    });
    this.receberDataPorEvento();
  }

  private receberDataPorEvento(){
    DetalhamentoClienteService.event.subscribe(res=>{ 
      this.dataRecebida = res
      this.consultaCarteiraDoCliente();
    });
  }

  public consultaCarteiraDoCliente(){
    this.detalhamentoService.consultaCarteiraDoCliente(this.dataRecebida, this.cdCliente).subscribe({
      next:(res)=>{
        this.valorCarteira = res[0].valor;
      }
    });
  }

}

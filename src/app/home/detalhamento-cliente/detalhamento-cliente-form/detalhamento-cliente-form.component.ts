import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-detalhamento-cliente-form',
  templateUrl: './detalhamento-cliente-form.component.html',
  styleUrls: ['./detalhamento-cliente-form.component.css']
})
export class DetalhamentoClienteFormComponent implements OnInit {

  nomeCliente: any;
  cdCliente: any;
  dataRecebida: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((res: any)=>{
      this.dataRecebida = res.data;
      this.nomeCliente = res.nomeCliente;
      this.cdCliente = res.cdCliente;
    });
  }

  public voltar(){
    this.router.navigate([`faturamento-mensal/${this.dataRecebida}`]);
  }

  public navegarPerspectivaAnual(){
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }
}

import { Component, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DetalhamentoClienteService } from 'src/app/services/detalhamento-cliente.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

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
    private router: Router,
    private controleService: ControleExibicaoService
  ) { }

  ngOnInit(): void {
    this.controleService.registrarLog('ACESSOU A TELA DETALHAMENTO DO CLIENTE');
    this.activeRoute.params.subscribe((res: any)=>{
      this.dataRecebida = res.data;
      this.nomeCliente = res.nomeCliente;
      this.cdCliente = res.cdCliente;
    });
  }

  public emitirData(){
    DetalhamentoClienteService.event.emit(this.dataRecebida);
  }

  public voltar(){
    this.router.navigate([`faturamento-mensal/${this.dataRecebida}`]);
  }

  public navegarPerspectivaAnual(){
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
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
  codigo: any;
  descricaoCliente: any;
  dataRecebida: any;
  clientes: Cliente[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private controleService: ControleExibicaoService,
    private clienteService: ClienteService
  ) { }

  ngOnInit(): void {
    this.controleService.registrarLog('ACESSOU A TELA DETALHAMENTO DO CLIENTE', 'DETALHAMENTO CLIENTE');
    this.activeRoute.params.subscribe((res: any) => {
      this.dataRecebida = res.data;
      this.nomeCliente = res.nomeCliente;
      this.cdCliente = res.cdCliente;
    });
    this.consultarCliente();
    //this.atulizarClientes();
  }

  public emitirData() {
    DetalhamentoClienteService.event.emit(this.dataRecebida);
  }

  public voltar() {
    window.history.back();
  }

  public navegarPerspectivaAnual() {
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }

  public exibirHistoricoAnualPorProduto() {
    this.router.navigate([`entrada-extrato-anual/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`]);
  }


  public consultarCliente() {
    this.clienteService.consultarClientes().subscribe(({
      next: (res) => {
        this.clientes = res;
      }, complete: () => {}
    }));
  }

  /**
   * Não está sendo utilizado no momento
   */
  public atulizarClientes() {
    this.clienteService.atualizarClientes(new ModeloConsulta().getInstance("", "", "consulta_clientes", "", undefined)).subscribe(({
      next: (res) => {}
    }));
  }

  limpar(){
     this.descricaoCliente = "";
  }

  public teste(cd: any) {
    this.descricaoCliente = cd.target.value;
    let cdCliente = cd.target.value.split('-');
    cdCliente[0]
    cdCliente[1]
    //Transforma o código de string para number
     this.codigo = (cdCliente[0]*1);
    //Verifica se o código é um numero
    if(!isNaN(this.codigo)){
      this.router.navigate([`detalhamento-cliente/${this.codigo}/${cdCliente[1]}/${this.dataRecebida}`]);
    }
  }

  
}

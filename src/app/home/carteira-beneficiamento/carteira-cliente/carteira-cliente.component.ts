import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarteiraCliente } from 'src/app/models/carteira/carteira-cliente';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { Sort } from '@angular/material/sort';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carteira-cliente',
  templateUrl: './carteira-cliente.component.html',
  styleUrls: ['./carteira-cliente.component.css']
})
export class CarteiraClienteComponent implements OnInit {

  tipoConsulta: any = 'CLIENTE';
  dataRecebida: any;
  cdBeneficiamento: any;
  clientes: CarteiraCliente[];
  modeloConsulta: ModeloConsulta;
  nomeBeneficiamento: any;
  itensPaginas = 15;
  paginasCarteiraCliente = 1;
  valorTotal: number = 0;
  toolTip = [];
  public exportarDados: boolean = false;
  private nomeTela = 'carteira-beneficiamento';

  constructor(
    private activeRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private router: Router,
    private exportService: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService
  ) {
    this.clientes = [];
    this.modeloConsulta = new ModeloConsulta();
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR CLIENTE [CARTEIRA BENEFICIAMENTO -> CLIENTE]');
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.activeRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.cdBeneficiamento = param.cdBeneficiamento;
      this.nomeBeneficiamento = param.nome;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela)
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      },
      complete: () => {
        this.consultaCateiraPorBeneficiamentoCliente();
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  //carteira-beneficiamento/:cdBeneficiamento/:cdCliente/:data/:nome
  public consultarProdutosPorCliente(cdCliente: any) {
    this.tipoConsulta = 'PRODUTO'
    this.router.navigate([`/carteira-beneficiamento/${this.cdBeneficiamento}/${cdCliente}/${this.dataRecebida}/${this.nomeBeneficiamento}`]);
  }

  public gerarArquivo() {
    this.exportService.geradorExcell(this.clientes, `carteira-cliente-${this.nomeBeneficiamento}`);
  }

  public consultaCateiraPorBeneficiamentoCliente() {
    this.clienteService.consultarCarteiraPorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, "", "", "", this.cdBeneficiamento)
    ).subscribe(res => {
      this.clientes = res.objeto;
      this.clientes.forEach(e => {
        this.valorTotal += e.valor;
      });
    })
  }

  public sortCliente(sort: Sort) {
    const data = this.clientes.slice();
    if (!sort.active || sort.direction === '') {
      this.clientes = data;
      return;
    }
    this.clientes = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeCliente':
          return compare(a.nome, b.nome, isAsc);
          break;
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

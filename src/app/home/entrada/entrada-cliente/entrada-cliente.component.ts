import { ExcelService } from './../../../services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaCliente } from 'src/app/models/entrada/entrada-cliente';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaService } from 'src/app/services/entrada.service';
import * as bootstrap from 'bootstrap';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-entrada-cliente',
  templateUrl: './entrada-cliente.component.html',
  styleUrls: ['./entrada-cliente.component.css']
})
export class EntradaClienteComponent implements OnInit {

  tipoConsulta: String = 'CLIENTE';
  modeloConsulta: ModeloConsulta;
  dataRecebida: any;
  cdBeneficiamento: any;
  entradas: EntradaCliente[];
  valorTotal: any = 0;
  exportarDados: boolean = false;
  public itensPagina: number = 20;
  public paginaEntradaCliente: number = 1;
  private nomeTela = "entrada";

  public toolTip = [];

  constructor(
    private router: Router,
    private entradaService: EntradaService,
    private activeRouter: ActivatedRoute,
    private exportDataService: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.entradas = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR CLIENTE EM ENTRADA', 'ENTRADA -> CLIENTE');
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.receberData();
    this.activeRouter.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.cdBeneficiamento = param.cdBeneficiamento;
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
        if (this.cdBeneficiamento) {
          this.consultaEntradasDeClientePorBeneficiamento();
        } else {
          this.consultarEntradaPorCliente();
        }
      },
      error: (e) => {
        console.log(e)
      }
    });
  }

  public voltar(){
    this.router.navigate(['/dashboard-sintetico'])
  }

  private receberData() {
    EntradaService.dataEntrada.subscribe(res => {
      this.dataRecebida = res;
      if (this.cdBeneficiamento) {
        this.consultaEntradasDeClientePorBeneficiamento();
      } else {
        this.consultarEntradaPorCliente();
      }
    });
  }

  public realizarConsultaPorData() {
    if (this.cdBeneficiamento) {
      this.consultaEntradasDeClientePorBeneficiamento();
    } else {
      this.consultarEntradaPorCliente();
    }
  }

  public consultaEntradasDeClientePorBeneficiamento() {
    this.entradas = [];
    this.entradaService.consultaEntradaDeClientePorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, 'cliente-beneficiamento', '', 1)
    ).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.somaTotais();
      }
    });
  }

  public gerarArquivo() {
    this.exportDataService.geradorExcell(this.entradas, "Entrada por clientes");
  }

  public consultarEntradaPorCliente() {
    this.entradas = [];
    this.entradaService.consultaEntradasPorCliente(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, 'entrada-cliente', '', undefined)
    ).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.somaTotais();
      }
    });
  }

  private somaTotais() {
    this.entradas.forEach((e) => {
      this.valorTotal += e.valor;
    });
  }

  public navegar(cdCliente: any, nomeCliente: any) {
    this.router.navigate([`entrada/produto/${cdCliente}/${this.dataRecebida}/${nomeCliente}`]);
    window.scrollTo(0, 0);
  }

  public sortCliente(sort: Sort) {
    const data = this.entradas.slice();
    if (!sort.active || sort.direction === '') {
      this.entradas = data;
      return;
    }

    this.entradas = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeCliente':
          return compare(a.nomeCliente, b.nomeCliente, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

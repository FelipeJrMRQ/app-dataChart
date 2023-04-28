import { Component, OnInit, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaBeneficiamento } from 'src/app/models/entrada/entrada-beneficiamento';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { ExcelService } from 'src/app/services/excel.service';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carteira-beneficiamento',
  templateUrl: './carteira-beneficiamento.component.html',
  styleUrls: ['./carteira-beneficiamento.component.css']
})
export class CarteiraBeneficiamentoComponent implements OnInit {

  modeloConsulta: ModeloConsulta;
  dataRecebida: any;
  cdCliente: any;
  nomeCliente: any;
  qtde: any = 0;
  area: any = 0;
  valor: any = 0;
  itensPorPagina: number = 10;
  paginaAtual: number = 1;
  beneficiamentos: EntradaBeneficiamento[];
  toolTip = [];
  public exportarDados: boolean = false;
  private nomeTela = 'carteira-cliente';

  constructor(
    private clienteService: ClienteService,
    private activeRoute: ActivatedRoute,
    private exportData: ExcelService,
    private router: Router,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.beneficiamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR BENEFICIAMENTO [CARTEIRA CLIENTE -> BENEFICIAMENTO] ')
    //Utilizado para exibição do tooltip bootstrap
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.activeRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.cdCliente = param.cdCliente;
      this.nomeCliente = param.nomeCliente;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso(){
      forkJoin({
        s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela)
      }).subscribe(({s1})=>{
        this.exportarDados = s1;
        this.consultarCarteiraPorBeneficiamentoDoCliente();
      })
  }

  public gerarArquivo() {
    this.exportData.geradorExcell(this.beneficiamentos, 'carteira_beneficiamento');
  }

  public consultarProdutosDoClientePorBeneficiamento(cdBeneficiamento: any){
      this.router.navigate([`carteira-cliente/${this.cdCliente}/${cdBeneficiamento}/${this.dataRecebida}/${this.nomeCliente}`])
  }

  private consultarCarteiraPorBeneficiamentoDoCliente() {
    this.clienteService.consultaCarteiraPorBeneficiamentoDoCliente(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, "", "", this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.beneficiamentos = res.objeto;
        this.beneficiamentos.forEach(e => {
          this.qtde += e.quantidade;
          this.area += e.area;
          this.valor += e.valor;
        })
      }, error: (e) => {

      }
    });
  }

  public sortBeneficiamento(sort: Sort) {
    const data = this.beneficiamentos.slice();
    if (!sort.active || sort.direction === '') {
      this.beneficiamentos = data;
      return;
    }

    this.beneficiamentos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'qtde':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

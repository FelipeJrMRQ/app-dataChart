import { ExcelService } from './../../../services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaBeneficiamento } from 'src/app/models/entrada/entrada-beneficiamento';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaService } from 'src/app/services/entrada.service';
import * as bootstrap from 'bootstrap';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-entrada-beneficiamento',
  templateUrl: './entrada-beneficiamento.component.html',
  styleUrls: ['./entrada-beneficiamento.component.css']
})
export class EntradaBeneficiamentoComponent implements OnInit {

  cdBeneficiamento: any;
  dataRecebida: any;
  modeloConsulta: ModeloConsulta;
  entradas: EntradaBeneficiamento[];
  qtdeTotal: any = 0;
  areaTotal: any = 0;
  valorTotal: any = 0;
  exportarDados: boolean = false;
  public itensPagina: number = 15;
  public paginaEntradaBeneficiamento: number = 1;
  public toolTip = [];
  private nomeTela = "entrada";

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private entradaService: EntradaService,
    private exportDataService: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
    private renderer: Renderer2,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.entradas = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR BENEFICIAMENTO EM ENTRADA', 'ENTRADA -> BENEFICIAMENTO')
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    this.activeRouter.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
    }).subscribe({
      next:({s1})=>{
        this.exportarDados = s1;
      },
      complete:()=>{
        this.consultaEntradasPorBeneficiamento();
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }



  public gerarArquivo() {
    this.exportDataService.geradorExcell(this.entradas, "Entrada por beneficiamento");
  }

  public navegar(cdBeneficiamento: any, nomeBeneficiamento: any) {
    this.router.navigate([`entrada/beneficiamento/cliente/${cdBeneficiamento}/${this.dataRecebida}/${nomeBeneficiamento}`]);
  }

  public consultaEntradasPorBeneficiamento() {
    this.entradaService.consultaEntradasPorBeneficiamento(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, 'entrada-beneficiamento', '', undefined)
    ).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.somaTotais();
      }
    });
  }

  private somaTotais() {
    this.entradas.forEach((e) => {
      this.areaTotal += e.area;
      this.qtdeTotal += e.quantidade;
      this.valorTotal += e.valor;
    })
  }

  public sortBeneficiamento(sort: Sort) {
    const data = this.entradas.slice();
    if (!sort.active || sort.direction === '') {
      this.entradas = data;
      return;
    }

    this.entradas = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'quantidade':
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

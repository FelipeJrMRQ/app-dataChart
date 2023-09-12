import { CarteiraExport } from 'src/app/models/exports/carteira-export';
import { ExcelService } from './../../../../services/excel.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import * as moment from 'moment';
import { CarteiraBeneficiamento } from 'src/app/models/carteira/carteira-beneficiamento';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { BeneficiamentoService } from 'src/app/services/beneficiamento.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import * as bootstrap from 'bootstrap';
import { Sort } from '@angular/material/sort';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tbl-carteira-beneficiamento',
  templateUrl: './tbl-carteira-beneficiamento.component.html',
  styleUrls: ['./tbl-carteira-beneficiamento.component.css']
})
export class TblCarteiraBeneficiamentoComponent implements OnInit, OnDestroy {

  modeloConsulta: ModeloConsulta;
  public upDateOption: string = 'd-none';
  private intervalo: any;

  //Listas
  public listaCateriaBeneficiamento: CarteiraBeneficiamento[];
  public toolTip = [];

  //valor
  valorTotalBeneficiamento: number = 0;

  //Controle de paginacao
  public itensPagina: number = 15;
  public paginaCliente = 1;
  public paginaBenificiamento = 1;

  //datas
  private dataRecebida: string = moment().format();

  public exportarDados: boolean = false;
  private nomeTela = 'dashboard-analitico';

  constructor(
    private beneficiamentoService: BeneficiamentoService,
    private exportDataService: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
    private router: Router,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.listaCateriaBeneficiamento = [];
  }

  /**
  * Quando o usuário sair da tela
  * o intervalo em execução será
  * interrompido.
  */
  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.recebeDataAtualizada();
    this.verificaPermissaoDeAcesso();
  }

  public recebeDataAtualizada() {
    FaturamentoService.emitirData.subscribe(res => {
      this.dataRecebida = res;
      this.consultaCarteiraBeneficiamento();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados_carteira_beneficiamento', this.nomeTela)
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      },
      complete: () => {
        this.verificaSeOSistemaEstaAtualizando();
        this.consultaCarteiraBeneficiamento();
        this.calcularTotalCarteiraClienteBeneficiamento;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  /**
   * Este método quando acionado impede a interação do usuário com a tabela
   * até que o processo de atualização dos dados esteja completo
   */
  public verificaSeOSistemaEstaAtualizando() {
    if (this.intervalo == undefined) {
      this.intervalo = setInterval(() => {
        this.beneficiamentoService.isUpdateCarteiraBeneficiamento().subscribe({
          next: (res) => {
            if (res) {
              this.upDateOption = 'd-block';
            } else {
              this.upDateOption = 'd-none';
            }
          }
        })
      }, 3000);
    } else {
      clearInterval(this.intervalo);
    }
  }

  public consultaCarteiraBeneficiamento() {
    this.modeloConsulta.tipoConsulta = "carteira-beneficiamento";
    this.modeloConsulta.dataInicial = moment(this.dataRecebida).format("yyyy-MM-DD");
    this.beneficiamentoService.consultarCarteiraPorBeneficiamento(this.modeloConsulta).subscribe({
      next: (res) => {
        this.listaCateriaBeneficiamento = res.objeto;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.calculaValorCarteiraBeneficiamento();
      }
    });
  }

  private calculaValorCarteiraBeneficiamento() {
    this.valorTotalBeneficiamento = 0;
    this.listaCateriaBeneficiamento.forEach((p) => {
      this.valorTotalBeneficiamento += p.valor;
    });
  }

  public exibirDetalhesDoBeneficiamento(cdBeneficiamento: any, nome: any) {
    setTimeout(() => {
      this.router.navigate([`/carteira-beneficiamento/${cdBeneficiamento}/${moment(this.dataRecebida).format('yyyy-MM-DD')}/${nome}`]);
      window.scrollTo(0, 0);
    }, 100);
  }

  public calculoPercentual(valor: any) {
    return (valor * 100) / this.valorTotalBeneficiamento;
  }


  public get calcularTotalCarteiraClienteBeneficiamento() {
    let valor = 0;
    this.listaCateriaBeneficiamento.forEach((e) => {
      valor += e.valor;
    });
    return valor;
  }

  public gerarArquivoExportacao() {
    let listaCarteira: CarteiraExport[] = [];
    this.listaCateriaBeneficiamento.forEach((e) => {
      let beneficiamentoCarteiraExport = new CarteiraExport();
      beneficiamentoCarteiraExport.BENEFICIAMENTO = e.nome;
      beneficiamentoCarteiraExport.VALOR = e.valor;
      beneficiamentoCarteiraExport.DATA = e.data
      beneficiamentoCarteiraExport.DATA = moment(beneficiamentoCarteiraExport.DATA).format("DD/MM/yyyy")
      listaCarteira.push(beneficiamentoCarteiraExport);
    });
    this.exportDataService.geradorExcell(listaCarteira, "Carteira-beneficiamento");
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DA CARTEIRA POR BENEFICIAMENTO', '');
  }

  public ordernarBeneficiamento(sort: Sort) {
    const data = this.listaCateriaBeneficiamento.slice();
    if (!sort.active || sort.direction === '') {
      this.listaCateriaBeneficiamento = data;
      return;
    }

    this.listaCateriaBeneficiamento = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nome':
          return compare(a.nome, b.nome, isAsc);
        case 'valor':
          return compare(a.valor, b.valor, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

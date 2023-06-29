import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoMensalCliente } from 'src/app/models/faturamento/faturamento-mensal-cliente';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import * as bootstrap from 'bootstrap';
import { Sort } from '@angular/material/sort';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-faturamento-beneficiamento',
  templateUrl: './faturamento-beneficiamento.component.html',
  styleUrls: ['./faturamento-beneficiamento.component.css']
})
export class FaturamentoBeneficiamentoComponent implements OnInit {

  nomeBeneficiamento: any;
  cdBeneficiamento: any;
  //OBJETOS
  clientes: FaturamentoMensalCliente[];
  produtos: FaturamentoMensalProduto[];
  //DATA 
  dataRecebida: any;

  //VALOR
  totalCliente: number = 0;
  totalProdutos: number = 0;
  totalQtde: number = 0;

  //HTML VARIAVEIS 
  paginaProduto: number = 1;
  paginaCliente: number = 1;
  itensPagina: number = 20;
  dialogRef: any;
  toolTip = [];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: FaturamentoMensalService,
    private dateService: DateControllerService,
    private dialog: MatDialog,
    private exporta: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.clientes = [];
    this.produtos = [];
  }

  ngOnInit(): void {
    console.log('certo')
    // this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR BENEFICIAMENTO EM FATURAMENTO MENSAL');
    // this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    // var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
    //   return new bootstrap.Tooltip(tooltipTriggerEl);
    // });
    // this.activeRoute.params.subscribe((param: any) => {
    //   this.cdBeneficiamento = param.cdBeneficiamento;
    //   this.nomeBeneficiamento = param.nomeBeneficiamento;
    //   this.dataRecebida = param.data;
    // });
    // this.consultaDetalhesDoCliente();
    // this.consultaDetalhesDoProduto();
  }

  //METODOS DE ROTAS 
  public voltar() {
    this.router.navigate([`/faturamento-mensal/${this.dataRecebida}`]);
  }

  public navegar(cdCliente: any, nomeCliente: any) {
    this.router.navigate([`/faturamento-mensal/detalhe-cliente/${cdCliente}/${this.cdBeneficiamento}/${this.nomeBeneficiamento}/${nomeCliente}/${this.dataRecebida}`]);
  }

  //GERADOR EXCEL 
  public gerarExportProduto() {
    this.exporta.gerarExportProduto(this.produtos, `Faturamento-beneficiamento(${this.nomeBeneficiamento})-Mes`)
  }
  public gerarExportCliente() {
    this.exporta.gerarExportCliente(this.clientes, `Clientes-Com/beneficiamento(${this.nomeBeneficiamento})-Mes`);
  }

  //METODOS DE CONSULTAS
  public consultaDetalhesDoCliente() {
    this.service.detalhesDoBeneficiamentoPorCliente(
      this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdBeneficiamento)
      .subscribe({
        next: (res) => {
          this.clientes = res;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.somaTotalCliente();
        }
      });
  }

  public consultaDetalhesDoProduto() {
    this.service.detalhesDeProdutosDoBeneficiamento(
      this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdBeneficiamento)
      .subscribe({
        next: (res) => {
          this.produtos = res;
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
          this.somaTotalProdutos();
        }
      });
  }

  //METODOS DE CALCULOS

  private somaTotalCliente() {
    this.clientes.forEach(e => {
      this.totalCliente += e.valor;
    })
  }

  private somaTotalProdutos() {
    this.produtos.forEach(p => {
      this.totalProdutos += p.valor;
      this.totalQtde += p.quantidade;
    });
  }


  //ABRIR DIALOG
  public openDetalhesProduto(produto: FaturamentoMensalProduto) {
    this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '95vh',
    });
  }

  public sortProduto(sort: Sort) {
    const data = this.produtos.slice();
    if (!sort.active || sort.direction === '') {
      this.produtos = data;
      return;
    }

    this.produtos = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeProduto':
          return compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        default:
          return 0;
      }
    });
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

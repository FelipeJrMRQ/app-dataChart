import { ExcelService } from './../../../services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaBeneficiamento } from 'src/app/models/entrada/entrada-beneficiamento';
import { EntradaProduto } from 'src/app/models/entrada/entrada-produto';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaService } from 'src/app/services/entrada.service';
import { MatDialog } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import * as bootstrap from 'bootstrap';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-entrada-produto',
  templateUrl: './entrada-produto.component.html',
  styleUrls: ['./entrada-produto.component.css']
})
export class EntradaProdutoComponent implements OnInit {

  dataRecebida: any;
  cdCliente: any;
  tipoConsulta: any = 'PRODUTO';
  private modeloConsulta: ModeloConsulta;
  produtos: EntradaProduto[];
  beneficiamentos: EntradaBeneficiamento[];
  valorTotal: any = 0;
  totalQtde: any = 0;
  totalArea: any = 0;
  nomeCliente: any;
  dialogRef: any;
  toolTip = [];
  exportarDados: boolean = false;
  private visualizarDetalhesProduto: boolean = false;
  public paginaEntradaProduto: number = 1;
  public itensPagina: number = 15;

  public paginaProdutoBeneficiamento: number = 1;
  public itensPaginaB: number = 15;
  private nomeTela: string = "entrada"
  private snackBarErro = 'my-snack-bar-erro';
  private snackBarSucesso = 'my-snack-bar-sucesso';



  constructor(
    private activeRoute: ActivatedRoute,
    private entradaService: EntradaService,
    private exportDataService: ExcelService,
    private router: Router,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private snackBar: MatSnackBar,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.produtos = [];
    this.beneficiamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ENTRADA POR PRODUTO', 'ENTRADA -> PRODUTO')
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

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela),
    }).subscribe({
      next: ({ s1, s2 }) => {
        this.exportarDados = s1;
        this.visualizarDetalhesProduto = s2;
      },
      complete: () => {
        this.consultarEntradaPorProdutos();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  public exibirHistoricoAnualPorProduto() {
    this.router.navigate([`entrada-extrato-anual/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`]);
  }

  public gerarArquivo() {
    this.exportDataService.geradorExcell(this.produtos, "Produtos do clientes");
  }

  public gerarArquivoB() {
    this.exportDataService.geradorExcell(this.beneficiamentos, "beneficiamentos do clientes");
  }

  public mudarPagina(cdBeneficiamento: any, data: any) {
    this.router.navigate([`entrada/produto/beneficiamento/${this.cdCliente}/${cdBeneficiamento}/${data}/${this.nomeCliente}`])
  }

  public consultarEntradaPorProdutos() {
    this.entradaService.consultaEntradasPorProduto(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, 'entrada-produto', '', this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.produtos = res.objeto;
        this.calculaTotaisProduto();
      }
    });
  }

  public consultaEntradasPorClienteBeneficiamento() {
    this.entradaService.consultaEntradasPorBeneficiamentoCliente(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, 'entrada-beneficiamento', '', this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.beneficiamentos = res.objeto;
      }
    });
  }

  private calculaTotaisProduto() {
    this.valorTotal = 0;
    this.totalQtde = 0;
    this.produtos.forEach((e) => {
      this.totalQtde += e.quantidade;
      this.valorTotal += e.valorTotal;
      this.totalArea += e.area;
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
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
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
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'valorTotal':
          return compare(a.valorTotal, b.valorTotal, isAsc);
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
    });
  }

  public openDetalhesProduto(produto: EntradaProduto) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
        data: produto,
        maxHeight: '90vh',
      });
    }else{
      this.openSnackBar('Você não possui acesso a detalhes do produto', this.snackBarErro);
    }
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

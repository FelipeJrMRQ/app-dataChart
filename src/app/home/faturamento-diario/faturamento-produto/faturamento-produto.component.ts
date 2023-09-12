import { ExcelService } from './../../../services/excel.service';
import { FaturamentoProduto } from '../../../models/faturamento/faturamento-produto';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { Sort } from '@angular/material/sort';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { FaturamentoBeneficiamento } from 'src/app/models/faturamento/faturamento-beneficiamento';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-faturamento-produto',
  templateUrl: './faturamento-produto.component.html',
  styleUrls: ['./faturamento-produto.component.css']
})
export class FaturamentoProdutoComponent implements OnInit {

  id: any;
  dataAtual: any;
  nomeCliente: any;
  valorTotal: any = 0;
  totalArea: any = 0;
  totalQtde: any = 0;
  cdCliente: any = 0;
  dialogRef: any;
  beneficiamentos: FaturamentoBeneficiamento[];
  produtosLista: FaturamentoProduto[];
  modeloConsulta: ModeloConsulta;
  tipoConsulta: any = "PRODUTO";
  btnDisable: any = false;
  exportarDados: boolean = false;
  private nomeTela: string = 'faturamento-diario';
  private visualizarDetalhesProduto: boolean = false;
  public itensPagina: number = 15;
  public paginasFaturamentoProduto: number = 1;
  public paginasFaturamentoBeneficiamento: number = 1;
  private snackBarErro = 'my-snack-bar-erro';
  private snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private router: Router,
    private activeRouter: ActivatedRoute,
    private faturamentoService: FaturamentoService,
    private exportDataService: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.produtosLista = [];
    this.beneficiamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR PRODUTO EM FATURAMENTO DIARIO', 'FATURAMENTO DIARIO -> PRODUTO');
    this.activeRouter.params.subscribe((param: any) => {
      this.id = param.id;
      this.dataAtual = param.data;
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
        this.consultaFaturamentoPorProduto();
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  public gerarArquivo() {
    this.exportDataService.geradorExcell(this.produtosLista, "Faturamento_Cliente_Produto");
  }
  public gerarArquivoB() {
    this.exportDataService.gerarExportBeneficiamentoDiario(this.beneficiamentos, "Faturamento_Cliente_Beneficiamento");
  }

  public sortProduto(sort: Sort) {
    const data = this.produtosLista.slice();
    if (!sort.active || sort.direction === '') {
      this.produtosLista = data;
      return;
    }

    this.produtosLista = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'nomeProduto':
          return compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'valorTotal':
          return compare(a.valor, b.valor, isAsc);
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
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
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
    });
  }

  /**
   * Retorna a data no formato dd/mm/yyyy
   */
  public get data() {
    return moment(this.dataAtual).format('DD/MM/yyyy')
  }

  public consultaFaturamentoPorProduto() {
    this.btnDisable = true;
    this.valorTotal = 0;
    this.totalArea = 0;
    this.totalQtde = 0;
    this.modeloConsulta.id = this.id;
    this.modeloConsulta.tipoConsulta = "faturamento-cliente-produto";
    this.modeloConsulta.dataInicial = this.dataAtual;
    this.modeloConsulta.dataFinal = this.dataAtual;
    this.faturamentoService.consultaFaturamentoPorProduto(this.modeloConsulta).subscribe({
      next: (res) => {
        this.produtosLista = res.objeto;
      }, error: (e) => {
        console.log(e)
      }, complete: () => {
        this.produtosLista.forEach((e) => {
          this.totalArea += e.area;
          this.valorTotal += e.valor;
          this.totalQtde += e.quantidade;
          this.btnDisable = false;
        });
      }
    });
  }

  public consultaFaturamentoPorBeneficiamento() {
    this.faturamentoService.consultaFaturamentoPorBeneficiamentoCliente(
      this.modeloConsulta.getInstance(this.dataAtual, this.dataAtual, "faturamento-beneficiamento", "", this.id)
    ).subscribe({
      next: (res) => {
        this.beneficiamentos = res.objeto;
      }, error: (e) => {
        console.log(e);
      }
    });
  }

  public voltarPagina(data: any) {
    this.router.navigate([`/faturamento-diario/${data}`])
  }

  public openDetalhesProduto(produto: FaturamentoProduto) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
        data: produto,
        maxHeight: '95vh',
      });
    } else {
      this.openSnackBar('Você não possui permissão de acesso a detalhes do produto!', this.snackBarErro);
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

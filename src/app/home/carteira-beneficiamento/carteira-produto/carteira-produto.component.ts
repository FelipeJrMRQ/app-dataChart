import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { Sort } from '@angular/material/sort';
import * as bootstrap from 'bootstrap';
import { CarteiraProduto } from 'src/app/models/carteira/carteira-produto';
import { MatDialog } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-carteira-produto',
  templateUrl: './carteira-produto.component.html',
  styleUrls: ['./carteira-produto.component.css']
})
export class CarteiraProdutoComponent implements OnInit {

  cdCliente: any;
  cdBeneficiamento: any;
  dataRecebida: any;
  modeloConsulta: ModeloConsulta;
  produtos: CarteiraProduto[];
  itensPagina: number = 20;
  paginasCarteiraProduto: number = 1;
  nomeBeneficiamento: any;
  valorTotal: number = 0;
  valorTQuantidade: number = 0;
  valorTotalArea: number = 0;
  toolTip = [];
  dialogRef: any;
  public exportarDados: boolean = false;
  public visualizarDetalhesProduto: boolean = false;
  private nomeTela = 'carteira-beneficiamento';
  private snackBarErro = 'my-snack-bar-erro';
  private snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private activeRoute: ActivatedRoute,
    private clienteService: ClienteService,
    private exportService: ExcelService,
    private renderer: Renderer2,
    private router: Router,
    private dialog: MatDialog,
    private controleExibicaoService: ControleExibicaoService,
    private snackBar: MatSnackBar,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.produtos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR PRODUTO [CARTEIRA BENEFICIAMENTO -> PRODUTO]');
    //Metodo de exibição do tooltip bootstrap
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    //Recebimento de parametros via URL
    this.activeRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.cdBeneficiamento = param.cdBeneficiamento;
      this.nomeBeneficiamento = param.nome;
      this.cdCliente = param.cdCliente;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela)
    }).subscribe({
      next: ({ s1, s2 }) => {
        this.exportarDados = s1;
        this.visualizarDetalhesProduto = s2;
      },
      complete: () => {
        if (this.cdCliente) {
          this.consultarCarteiraPorClienteBeneficiamentoData();
        } else {
          this.consultarCarteriraPorBeneficiamentoProduto();
        }
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

  public voltarPaginaAnterior() {
    this.router.navigate([`carteira-beneficiamento/${this.cdBeneficiamento}/${this.dataRecebida}/${this.nomeBeneficiamento}`]);
  }

  public consultarCarteiraPorClienteBeneficiamentoData() {
    this.clienteService.consultaCarteiraPorBeneficiamentoDataProdutoCliente(this.cdBeneficiamento, this.cdCliente, this.dataRecebida).subscribe({
      next: (res) => {
        this.produtos = res;
        this.produtos.forEach(e => {
          this.valorTotal += e.valor;
          this.valorTQuantidade += e.quantidade;
          this.valorTotalArea += e.area;
        });
      }
    });
  }

  public consultarCarteriraPorBeneficiamentoProduto() {
    this.clienteService.consultaCarteiraPorBeneficiamentoProduto(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, "", "", this.cdBeneficiamento)
    ).subscribe({
      next: (res) => {
        this.produtos = res;
        this.produtos.forEach(e => {
          this.valorTotal += e.valor;
          this.valorTQuantidade += e.quantidade;
          this.valorTotalArea += e.area;
        });

      }
    })
  }

  public openDetalhesProduto(produto: CarteiraProduto) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
        data: produto,
        maxHeight: '90vh',
      });
    }else{
      this.openSnackBar('Você não tem permissão de acesso aos detalhes do produto!', this.snackBarErro);
    }
  }

  public gerarArquivo() {
    this.exportService.geradorExcell(this.produtos, `Carteira-Beneficiamento-Produto-${this.nomeBeneficiamento}`)
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
        case 'nomeCliente':
          return compare(a.nomeCliente, b.nomeCliente, isAsc);
        case 'nomeProduto':
          return compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'quantidade':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        default:
          return 0;
      }
    });
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

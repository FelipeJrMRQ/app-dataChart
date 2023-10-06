import { Component, OnInit, Renderer2 } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { CarteiraProduto } from 'src/app/models/carteira/carteira-produto';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ClienteService } from 'src/app/services/cliente.service';
import { ExcelService } from 'src/app/services/excel.service';
import * as bootstrap from 'bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-carteira-produto',
  templateUrl: './carteira-produto.component.html',
  styleUrls: ['./carteira-produto.component.css']
})
export class CarteiraProdutoComponent implements OnInit {


  cdBeneficiamento: any;
  cdCliente: any;
  nomeCliente: any;
  dataRecebida: any;
  modeloConsulta: ModeloConsulta;
  produtos: CarteiraProduto[];
  produtosTemp: any = [];
  qtde: any = 0;
  area: any = 0;
  valorTotal: any = 0;
  itensPorPagina: any = 20;
  paginaAtual: any = 1;
  toolTip = [];
  dialogRef: any;
  nomeProduto: any = '';
  public exportarDados: boolean = false;
  public visualizarDetalhesProduto: boolean = false;
  private nomeTela = 'carteira-cliente';


  constructor(
    private clienteService: ClienteService,
    private activeRoute: ActivatedRoute,
    private exportData: ExcelService,
    private renderer: Renderer2,
    private router: Router,
    private dialog: MatDialog,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.produtos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR PRODUTO [CARTEIRA CLIENTE -> PRODUTO]', 'CARTEIRA-CLIENTE -> PRODUTO');
    //Utilizado para visualização do tooltip bootstrap
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    this.activeRoute.params.subscribe((param: any) => {
      this.cdCliente = param.cdCliente;
      this.dataRecebida = param.data;
      this.cdBeneficiamento = param.cdBeneficiamento;
      this.nomeCliente = param.nomeCliente;
      this.verificaPermissaoDeAcesso();
    });

  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela),
    }).subscribe(({ s1, s2 }) => {
      this.exportarDados = s1;
      this.visualizarDetalhesProduto = s2;
      if (this.cdBeneficiamento) {
        this.consultarCarteiraPorBeneficiamentoDeProdutos();
      } else {
        this.consultarCarteiraPorProdutosDoCliente();
      }
    })
  }

  public gerarArquivo() {
    this.exportData.geradorExcell(this.produtos, 'carteira-produto');
  }

  public voltarPaginaAnterior() {
    window.history.back();
  }

  public consultarCarteiraPorBeneficiamentoDeProdutos() {
    this.limparVariaveis();
    this.clienteService.consultaCarteiraPorBeneficiamentoDataProdutoCliente(this.cdBeneficiamento, this.cdCliente, this.dataRecebida).subscribe({
      next: (res) => {
        this.produtos = res;
        this.produtos.forEach((e) => {
          this.qtde += e.quantidade;
          this.area += e.area;
          this.valorTotal += e.valor;
        });
      }, complete:()=>{
        this.produtosTemp = [...this.produtos];
      }
    });
    
  }

  private limparVariaveis() {
    this.produtos = [];
    this.qtde = 0;
    this.area = 0;
    this.valorTotal = 0;
  }

  public consultarCarteiraPorProdutosDoCliente() {
    this.limparVariaveis();
    this.clienteService.consultaCarteiraPorProdutoDoCliente(
      this.modeloConsulta.getInstance(this.dataRecebida, this.dataRecebida, "", "", this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.produtos = res;
        this.produtos.forEach((e) => {
          this.qtde += e.quantidade;
          this.area += e.area;
          this.valorTotal += e.valor;
        });
      }, error: (e) => {
        console.log(e);
      },complete:()=>{
        this.produtosTemp = [...this.produtos];
      }
    });
   
  }

  public sortProduto(sort: Sort) {
    const data = this.produtosTemp.slice();
    if (!sort.active || sort.direction === '') {
      this.produtosTemp = data;
      return;
    }

    this.produtosTemp = data.sort((a:any, b:any) => {
      const isAsc = sort.direction === 'desc';
      switch (sort.active) {
        case 'nomeProduto':
          return compare(a.nomeProduto, b.nomeProduto, isAsc);
        case 'nomeBeneficiamento':
          return compare(a.nomeBeneficiamento, b.nomeBeneficiamento, isAsc);
        case 'qtde':
          return compare(a.quantidade, b.quantidade, isAsc);
        case 'area':
          return compare(a.area, b.area, isAsc);
        case 'preco':
          return compare(a.valorUnitario, b.valorUnitario, isAsc);
        default:
          return 0;
      }
    });
  }


  public openDetalhesProduto(produto: CarteiraProduto) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
        data: produto,
        maxHeight: '90vh',
      });
    }
  }

  public filtrar(){
    let temp: any = this.produtos.filter(p=> {
      return p.nomeProduto.includes(this.nomeProduto.toUpperCase());
    });
    if(temp.length == 0){
      temp = [{ nomeProduto: 'PRODUTO NÃO ENCONTRADO.' }];
    }
    this.produtosTemp = [...temp];
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

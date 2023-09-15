import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoMensalBeneficiamento } from 'src/app/models/faturamento/faturamento-mensal-beneficiamento';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import * as bootstrap from 'bootstrap';
import { Sort } from '@angular/material/sort';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-faturamento-cliente',
  templateUrl: './faturamento-cliente.component.html',
  styleUrls: ['./faturamento-cliente.component.css']
})
export class FaturamentoClienteComponent implements OnInit {

  private cdCliente: any;
  nomeCliente: any;

  //OBJETOS
  produtos: FaturamentoMensalProduto[];
  beneficiamentos: FaturamentoMensalBeneficiamento[];

  //HTML VARIAVEIS
  paginaBeneficiamento: number = 1;
  paginaProduto: number = 1;
  itensPagina: number = 20;
  dialogRef: any;
  toolTip= [];

  //VALOR
  totalBeneficiamento: number = 0;
  totalProduto: number = 0;
  totalQtde: number = 0;

  //DATA
  dataRecebida: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private faturamentoMensalService: FaturamentoMensalService,
    private dateService: DateControllerService,
    private dialog: MatDialog,
    private exporta: ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.produtos = [];
    this.beneficiamentos = [];
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES POR CLIENTE EM FATURAMENTO MENSAL', 'FATURAMENTO MENSAL -> CLIENTE');
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function(tooltipTriggerEl){
     return new bootstrap.Tooltip(tooltipTriggerEl);
   });
    this.activeRoute.params.subscribe((param: any) => {
      this.cdCliente = param.cdCliente;
      this.nomeCliente = param.nomeCliente;
      this.dataRecebida = param.data;
    });
    this.consultarDetalhesPorCliente();
    this.consultaDetalhesPorProduto();
  }

  //METODOS DE MUDANÇA DE ROTA
  public navegar(cdBenficiamento: any) {
    this.router.navigate([`faturamento-mensal/detalhe-beneficiamento/${this.cdCliente}/${cdBenficiamento}/${this.nomeCliente}/${this.dataRecebida}`]);
  }

  public navegarPerspectivaAnual(){
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }

  public navegarDetalhamentoCliente(){
     this.router.navigate([`detalhamento-cliente`]); 
  }

  public voltar() {
    // this.router.navigate([`/faturamento-mensal/${this.dataRecebida}`]);
    window.history.back();
  }

  //GERADORES EXCELL
  public gerarExportBeneficiamento() {
    this.exporta.gerarExportBeneficiamento(this.beneficiamentos, `beneficiamento-${this.nomeCliente}`);
  }
  
  public gerarExportProduto() {
    this.exporta.gerarExportProduto(this.produtos, `Produto-Mensal-${this.nomeCliente}`);
  }

  //METODOS DE CONSULTA
  public consultaDetalhesPorProduto() {
    this.faturamentoMensalService.detalhesDoClientePorProduto(this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdCliente).subscribe({
      next: (res) => {
        this.produtos = res;
      }, complete: () => {
        this.somaValorTotalProduto();
      }
    });
  }

  public consultarDetalhesPorCliente() {
    this.faturamentoMensalService.detalhesDoClientePorBeneficiamento(this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdCliente).subscribe({
      next: (res) => {
        this.beneficiamentos = res;
      }, complete: () => {
        this.somaValorTotalBenficiamento();
      }
    });
  }

  //ABRIR DIALOG
  public openDetalhesProduto(produto: FaturamentoMensalProduto) {
    this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '95vh'
    });
  }


  //METODOS DE CALCULOS
  somaValorTotalBenficiamento() {
    this.beneficiamentos.forEach((b) => {
      this.totalBeneficiamento += b.valor;
    });
  }

  somaValorTotalProduto() {
    this.produtos.forEach((p) => {
      this.totalProduto += p.valor;
      this.totalQtde += p.quantidade;
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

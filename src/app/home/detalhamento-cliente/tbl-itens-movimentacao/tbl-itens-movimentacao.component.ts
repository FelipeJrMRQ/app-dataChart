import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { MovimentoProduto } from 'src/app/models/movimentoProduto';
import { ExcelService } from 'src/app/services/excel.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-tbl-itens-movimentacao',
  templateUrl: './tbl-itens-movimentacao.component.html',
  styleUrls: ['./tbl-itens-movimentacao.component.css']
})
export class TblItensMovimentacaoComponent implements OnInit {

  itensPagina: any = 20;
  pagina: any = 1;
  dataAtual: any;
  cdCliente: any;
  valorMes: any = 1;
  movimentacaoProduto: MovimentoProduto[] = []
  dataFinal = moment().subtract(1, 'month').format("yyyy-MM-DD");
  dataInicial =  moment().format("yyyy-MM-DD");
  private nomeTela = "detalhamento-cliente";
  controle = false;


  constructor(
    private produtoService: ProdutoService,
    private routerNavegation: ActivatedRoute,
    private dateService: DateControllerService,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    
  }

  ngOnInit(): void {
    this.routerNavegation.paramMap.subscribe(params => {
      this.cdCliente = params.get("cdCliente")
      this.dataAtual = params.get("data");
      if(params.get('meses') != undefined){
        this.valorMes = params.get('meses');
      }
      this.verificarPermissaoDeAcesso();
    });
  }


  private verificarPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados_movimento', this.nomeTela),
    }).subscribe({
      next: ({ s1 }) => {
        this.controle = s1;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.subtrairDataAtual(this.valorMes);
        this.receberMeses();
      }
    });
  }

  public receberMeses(){
    ProdutoService.movimentoProdutos.subscribe(res=>{
      this.valorMes = res;
    })
  }

  public subtrairDataAtual(meses: number) {
    this.dataFinal= moment().subtract(meses , 'month').format('yyyy-MM-DD');
    this.dataInicial = this.dateService.getInicioDoMes(this.dataFinal);
    let diferenca = moment().diff(this.dataFinal, 'month');
    if(diferenca == 1){
      this.consultarMovimentacaoCliente();
    }else{
      this.dataInicial = this.dateService.getInicioDoMes(this.dataFinal);
      this.dataFinal = this.dateService.getFimDoMes(this.dataFinal);
      this.consultarMovimentacaoCliente();
    }
  }

  public consultarMovimentacaoCliente() {
    this.produtoService.consultarMovimentacaoCliente(this.dataInicial, this.dataFinal, this.cdCliente).subscribe({
      next: (res) => {
        this.movimentacaoProduto = res;
      },
    })
  }

  public visualizarDetalhesDoProduto(produto: any){
    this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '90vh',
    });
  }

  public getDias(data: any){
    return moment().diff(data, 'days');
  }

  public exportarDados(){
    this.excelService.geradorExcell(this.movimentacaoProduto, 'movimentacao');
  }


}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Produto } from 'src/app/models/produto/Produto';
import { ExcelService } from 'src/app/services/excel.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-tbl-novos-itens',
  templateUrl: './tbl-novos-itens.component.html',
  styleUrls: ['./tbl-novos-itens.component.css']
})
export class TblNovosItensComponent implements OnInit {

  pagina: any = 1;
  private dataRecebida: any = moment().format('yyyy-MM-DD');
  produtos: Produto[] = [];
  controle: any = false;
  private nomeTela = "dashboard-sintetico";

  constructor(
    private produtoService: ProdutoService,
    private dateService: DateControllerService,
    private exportService: ExcelService,
    private dialog: MatDialog,
    private controleExibicaoService: ControleExibicaoService,
  ) { 
    
  }

  ngOnInit(): void {
    FaturamentoService.emitirData.subscribe(res=>{
      this.dataRecebida = res;
     this.verificaPermissaoDeAcesso();
    });
    this.verificaPermissaoDeAcesso();
  }

  public verificaPermissaoDeAcesso(){
    forkJoin({
      s1 : this.controleExibicaoService.verificaPermissaoDeAcesso('tabela_novos_negocios', this.nomeTela)
    }).subscribe(({s1})=>{
        if(s1){
          this.controle = true;
          this.consultarNovosProdutosDoMes();
        }
    })
  }

  private consultarNovosProdutosDoMes(){
    this.produtoService.consultaProdutosPorPeriodoInclusao(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida).subscribe({
      next:(res)=>{
        this.produtos = res;
      }
    });
  }

  public exportarDados(){
    this.exportService.geradorExcell(this.produtos, 'novos_negocios');
  }

  public visualizarDetalhesDoProduto(produto: any){
    this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '90vh'
    });
  }
}

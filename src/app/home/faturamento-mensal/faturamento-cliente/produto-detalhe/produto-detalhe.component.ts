import { ExcelService } from 'src/app/services/excel.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoMensalProduto } from 'src/app/models/faturamento/faturamento-mensal-produto';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import * as bootstrap from 'bootstrap';
import { Sort } from '@angular/material/sort';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-produto-detalhe',
  templateUrl: './produto-detalhe.component.html',
  styleUrls: ['./produto-detalhe.component.css']
})
export class ProdutoDetalheComponent implements OnInit {

  nomeCliente: any;
  cdCliente: any;
  cdBeneficiamento: any;

  //DATA
  dataRecebida: any;

  //LISTAS
  produtos: FaturamentoMensalProduto[];

  //VALORES 
  totalProduto: number = 0;
  totalQtde: number = 0;
  totalArea: number = 0;

  //HTML
  paginaProduto: number = 1;
  itensPagina: number = 20;
  dialogRef: any;
  toolTip = [];


  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private faturamentoMensalService: FaturamentoMensalService,
    private dateService: DateControllerService,
    private dialog: MatDialog,
    private exporta:ExcelService,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.produtos = [];
   }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DETALHES DO PRODUTO: [FATURAMENTO MENSAL -> CLIENTE -> BENEFICIAMENTO ]')
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function(tooltipTriggerEl){
     return new bootstrap.Tooltip(tooltipTriggerEl);
   });
    this.activeRoute.params.subscribe((param:any)=>{
        this.cdCliente = param.cdCliente;
        this.cdBeneficiamento = param.cdBeneficiamento;
        this.dataRecebida = param.data;
        this.nomeCliente = param.nomeCliente;
    });
    this.consultaDetalhesDoBeneficamento();
  }
//METODOS DE MUDANÇA DE ROTA
  public voltar(){
    this.router.navigate([`faturamento-mensal/cliente/${this.cdCliente}/${this.nomeCliente}/${this.dataRecebida}`]);
  }
//METODO GERANDO ARQUIVO
  public gerarExportProduto(){
    this.exporta.gerarExportProduto(this.produtos,`Produto-Mensal-${this.nomeCliente}`);
  }


 //METODOS DE CONSULTAS
  public consultaDetalhesDoBeneficamento(){
    this.faturamentoMensalService.detalhesDoBeneficiamentoPorProduto(this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format('yyyy-MM-DD'), this.cdCliente, this.cdBeneficiamento).subscribe({
      next:(res)=>{
        this.produtos = res;
      },complete:()=>{
        this.somaValorTotal();
      }
    });
  }

  public openDetalhesProduto(produto: FaturamentoMensalProduto) {
    this.dialogRef = this.dialog.open(DlgFatMensalProdutoComponent, {
      data: produto,
      maxHeight: '95vh',
    });
  }

//METODOS DE CALCULOS
  somaValorTotal(){
    this.produtos.forEach((p)=>{
      this.totalProduto += p.valor;
      this.totalQtde += p.quantidade;
      this.totalArea += p.area;
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
        case 'area':
          return compare(a.area, b.area, isAsc);
          case 'quantidade':
            return compare(a.quantidade, b.quantidade, isAsc);
        default:
          return 0;
      }
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

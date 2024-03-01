import * as bootstrap from 'bootstrap';
import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { MovimentoCliente } from 'src/app/models/movimentoCliente';
import { ExcelService } from 'src/app/services/excel.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'tbl-movimento-produtos',
  templateUrl: './tbl-movimento-produtos.component.html',
  styleUrls: ['./tbl-movimento-produtos.component.css']
})
export class CardMovimentacaoComponent implements OnInit, OnDestroy, AfterViewInit {

  movimentoCliente: MovimentoCliente[] = [];
  pagina: any = 1;
  dataAtual = moment().format("yyyy-MM-DD");
  valorMes: any = 1;
  dataInicial = moment().format("yyyy-MM-DD");
  dataFinal = moment().format("yyyy-MM-DD");
  private nomeTela = "dashboard-sintetico";
  controle = false;
  totalProdutos: number = 0;
  private toolTipElements: Element[] = [];
  private tooltips: bootstrap.Tooltip[] = [];

  constructor(
    private produtoService: ProdutoService,
    private router: Router,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
    private excelService: ExcelService,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    this.verificaPermissaoDeAcesso();
  }


  ngAfterViewInit() {
    setTimeout(() => {
      // Selecione os elementos com o atributo data-bs-toggle="tooltip"
      this.toolTipElements = [].slice.call(this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));

      // Inicialize os tooltips
      this.tooltips = this.toolTipElements.map((tooltipTriggerEl: Element) => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    },500);
  }

  ngOnDestroy(): void {
    // Destrua os tooltips ao sair da página
    this.tooltips.forEach(tooltip => {
      if (tooltip && typeof tooltip.dispose === 'function') {
        tooltip.dispose();
      }
    });
  }

  /**
   * Caso o usuário altere a quantidade de meses na tela este
   * método será invocado e a consuta será refeita
   */
  public receberQuantidadeMeses() {
    ProdutoService.movimentoProdutos.subscribe((res) => {
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('tabela_movimentacao_produto', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.controle = s1;
        this.subtrairDataFinal(this.valorMes);
      }
    });
  }

  /**
   * Com base na data atual este método decrementa a quantidade de meses passada por parametro
   * Esta data obtida será utilizada como base na consulta de movimentação
   * @param meses 
   */
  public subtrairDataFinal(meses: any) {
    this.dataFinal = moment().subtract(meses, 'month').format('yyyy-MM-DD');
    this.dataInicial = this.dateService.getInicioDoMes(this.dataFinal);
    let diferenca = moment().diff(this.dataFinal, 'month');
    if (diferenca == 1) {
      this.consultaMovimentoProdutos();
    } else {
      this.dataInicial = this.dateService.getInicioDoMes(this.dataFinal);
      this.dataFinal = this.dateService.getFimDoMes(this.dataFinal);
      this.consultaMovimentoProdutos();
    }
  }

  public consultaMovimentoProdutos() {
    this.produtoService.consultarMovimentoProduto(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.movimentoCliente = res
      },
      complete: () => {
        ProdutoService.movimentoProdutos.emit(this.valorMes);
        this.calculaTotalDeProdutos();
      }
    });
  }

  public exportarDados() {
    this.excelService.geradorExcell(this.movimentoCliente, "movimento_cliente")
  }

  public detalheCliente(cdCliente: any, nome: any) {
    this.router.navigate([`/detalhamento-cliente/${cdCliente}/${nome}/${this.dataAtual}/${this.valorMes}`]);
  }

  private calculaTotalDeProdutos() {
    this.totalProdutos = 0;
    this.movimentoCliente.forEach(e => {
      this.totalProdutos += e.quantidade;
    });
  }



}

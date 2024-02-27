import { ExcelService } from 'src/app/services/excel.service';
import { MatDialog } from '@angular/material/dialog';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { EntradaService } from 'src/app/services/entrada.service';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExtratoBeneficiamento } from 'src/app/models/extratos/extrato-beneficiamento';


@Component({
  selector: 'app-extrato-anual-beneficiamento',
  templateUrl: './extrato-anual-beneficiamento.component.html',
  styleUrls: ['./extrato-anual-beneficiamento.component.css']
})
export class ExtratoAnualBeneficiamentoComponent implements OnInit {
  public nomeCliente: any;
  public cdCliente: any;
  public cdBeneficiamento: any;
  public dataRecebida: any;
  public nomeBeneficiamento = "";
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  colunasTabela: any = [];
  dados: any = [];
  dadosFiltro: any = [];
  exportarDadosExcel: boolean = true;
  visualizarDetalhesProduto: boolean = true;
  dialogRef: any;
  meses: any = [];
  visualizarQtde: string = ''
  visualizaValor: string = 'd-none'
  nomeBtn: string = "valor";
  ordenacaoAscendente: boolean = false;
  pagina: any = 1;
  itensPagina: any = 20;
  totaisMes: any = [];
  extrato: ExtratoBeneficiamento[] = [];
  private nomeTela: string  = "entrada-extrato-anual";
  valorA: any = 0;
  totalA: any = 0;
  totalB: any = 0;
  valorB: any = 0;


  constructor(
    private activeRouter: ActivatedRoute,
    private entradaService: EntradaService,
    private dialogo: MatDialog,
    private excelService: ExcelService,
    private dataService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
   
  }

  ngOnInit(): void {
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso(){
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados', this.nomeTela)
    }).subscribe(({s1, s2})=>{
      this.visualizarDetalhesProduto = s1;
      this.exportarDadosExcel = s2;
      this.activeRouter.params.subscribe((res: any) => {
        this.dataRecebida = res.data;
        this.cdCliente = res.cdCliente;
        this.nomeCliente = res.nomeCliente;
        this.consultaExtratoAnual();
      });
    });
  }

  public consultaExtratoAnual() {
    let dataInicial = moment(this.dataService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months').format('yyyy-MM-DD');
    this.entradaService.consultaExtratoAnualDeEntradasPorBeneficiamentoDoCliente(dataInicial, this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.extrato = res
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.montarColunasParaTabela();
      }
    });
  }

  public visualizarProdutosDoBeneficiamento(cdBeneficiamento: any){
    this.router.navigate([`entrada-extrato-anual-beneficiamento-produto/${this.dataRecebida}/${this.cdCliente}/${cdBeneficiamento}/${this.nomeCliente}`]);
  }

  private montarColunasParaTabela() {
    this.meses = [];
    this.colunasTabela = [];
    let data = moment(this.dataService.getInicioDoMes(this.dataRecebida)).subtract(12, 'months').format('yyyy-MM-DD');
    while (moment(data).isBefore(this.dataService.getInicioDoMes(this.dataRecebida))) {
      data = moment(data).add(1, 'month').format('yyyy-MM-DD');
      this.colunasTabela.push(moment(data).format('M-YY'));
      this.meses.push({ 'mesAno': `${moment(data).format('M-YY')}`, 'valor': 0, 'quantidade': 0 });
    }
    this.prepararDadosParaExibicao();
  }

  private prepararDadosParaExibicao() {
    this.dados = [];
    this.extrato.forEach(e => {
      let dataTemp = {
        'cdBeneficiamento': e.cdBeneficiamento,
        'nomeBeneficiamento': e.nomeBeneficiamento,
        'totalQtd': 0,
        'totalValor': 0,
        'meses': [...this.meses.map((mes: any) => ({ ...mes }))]
      }
      if (!this.dados.some((dt: any) => dt.cdBeneficiamento == e.cdBeneficiamento)) {
        this.dados.push(dataTemp);
      }
    });
    this.preencherValoresDosMeses();
  }

  private preencherValoresDosMeses() {
    this.dados.forEach((dt: any) => {
      dt.meses.forEach((mes: any) => {
        let benef = this.extrato.find((b: any) => b.cdBeneficiamento == dt.cdBeneficiamento && b.mes == mes.mesAno.split('-')[0]);
        if (benef) {
          dt.totalValor += benef?.valor;
          dt.totalQtd += benef?.quantidade;
          mes.valor = benef?.valor;
          mes.quantidade = benef.quantidade;
        }
      });
    });
    this.dadosFiltro = [...this.dados];
    this.calcularTotalPorMes();
  }

  public alterarModoDeVisualizacao() {
    if (this.visualizarQtde == 'd-none') {
      this.visualizarQtde = '';
      this.visualizaValor = 'd-none';
      this.nomeBtn = 'valor';
    } else {
      this.visualizarQtde = 'd-none';
      this.visualizaValor = '';
      this.nomeBtn = 'quantidade';
    }
  }

  public filtrarDadosPorProduto() {
    let temp = this.dados.filter((d: any) => {
      return d.nomeBeneficiamento.includes(this.nomeBeneficiamento.toUpperCase());
    });
    if (temp.length == 0) {
      temp = [{nomeBeneficiamento: 'BENEFICIAMENTO NÃO ENCONTRADO.'}];
    }
    this.dadosFiltro = [...temp];
  }

  public valorClass(valor: number) {
    if (valor == 0) {
      return 'text-danger';
    } else {
      return 'bold';
    }
  }

  private openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

  public alternarOrdem() {
    this.ordenacaoAscendente = !this.ordenacaoAscendente;
  }

  public ordenarPorTotais() {
    console.log(this.dadosFiltro)
    this.dadosFiltro.sort((a: any, b: any) => {
     if(this.nomeBtn == 'valor'){
      this.totalA = a.totalQtd || 0;
      this.totalB = b.totalQtd || 0;
     }else{
      this.totalA = a.totalValor || 0;
      this.totalB = b.totalValor || 0;
     }
      let resultado = 0;
      if (this.ordenacaoAscendente) {
        resultado = this.totalA - this.totalB;
      } else {
        resultado =this.totalB - this.totalA;
      }
      return resultado;
    });
    this.alternarOrdem();
  }

  /**
   * Com base no nome da coluna e o tipo de consulta sendo ela por valor ou quantidade
   * este método fara uma cosulta dos valores de A e B para efeito de comparacao no
   * modelo de ordenacao
   * @param a 
   * @param b 
   * @param nomeColuna 
   */
  private consultaValorParaOrdenacao(a:any, b:any, nomeColuna: any){
    if (this.nomeBtn == 'quantidade') {
      this.valorA = a.meses.find((vm: any) => vm.mesAno === nomeColuna)?.valor || 0;
      this.valorB = b.meses.find((vm: any) => vm.mesAno === nomeColuna)?.valor || 0;
    } else {
      this.valorA = a.meses.find((vm: any) => vm.mesAno === nomeColuna)?.quantidade || 0;
      this.valorB = b.meses.find((vm: any) => vm.mesAno === nomeColuna)?.quantidade || 0;
    }
  }

  /**
   * Realiza a definição de sentido da ordenacao sendo ela ASC ou DESC
   * conforme solicitado pelo usuário
   * @returns 
   */
  private defineSentidoOrdenacao(){
    if (this.ordenacaoAscendente) {
      return this.valorA - this.valorB;
    } else {
      return this.valorB - this.valorA;
    }
  }

  public ordenar(nomeColuna: string) {
    this.dadosFiltro.sort((a: any, b: any) => {
      this.consultaValorParaOrdenacao(a, b, nomeColuna);
      return this.defineSentidoOrdenacao(); 
    });
    this.alternarOrdem();
  }


  public exportarDados() {
    if (this.exportarDadosExcel) {
      let dataExport: any = [];
      this.dadosFiltro.forEach((beneficiamento: any) => {
        let obj: any = {
          'BENEFICIAMENTO': beneficiamento.nomeBeneficiamento
        }
        let prod = this.dadosFiltro.find((p: any) => p.cdBeneficiamento == beneficiamento.cdBeneficiamento);
        console.log(prod);
        if (prod) {
          prod.meses.forEach((p: any) => {
            if (this.visualizarQtde == '') {
              obj[p.mesAno] = p.quantidade;//Exporta dados por quantidade
            } else {
              obj[p.mesAno] = p.valor; //Exporta dados por valor
            }
          });
        }
        dataExport.push(obj);
      });
      this.excelService.geradorExcell(dataExport, 'extrato_entrada_');
    } else {
      this.openSnackBar('Você não possui permissão de acesso a exportação de dados.', this.snackBarErro);
    }
  }

  public exibirDetalhesDoProduto(cdProduto: any) {
    if (this.visualizarDetalhesProduto) {
      this.dialogRef = this.dialogo.open(DlgFatMensalProdutoComponent, {
        data: {
          cdProduto,
        },
        maxHeight: '95vh',
      });
    } else {
      this.openSnackBar('Você não possui permissão de acesso a detalhes do produto', this.snackBarErro);
    }
  }

  public calcularTotalPorMes() {
    this.totaisMes = [];
    this.colunasTabela.forEach((e: any) => {
      const totalMes: any = {
        'mesAno': e,
        'valorTotal': 0,
        'quantidadeTotal': 0
      };
      this.totaisMes.push(totalMes);
    });
    this.dadosFiltro.forEach((produto: any) => {
      produto.meses.forEach((mes: any) => {
        let mesExistente = this.totaisMes.find((item: any) => item.mesAno == mes.mesAno);
        if (mesExistente) {
          mesExistente.valorTotal += mes.valor;
          mesExistente.quantidadeTotal += mes.quantidade;
        }
      });
    });
    let totalGeral = this.totaisMes.reduce((total: any, objeto: any) => total + objeto.valorTotal, 0);
    let quantidadeGeral = this.totaisMes.reduce((qtde: any, objeto: any) => qtde + objeto.quantidadeTotal, 0);
    if (this.totaisMes.length > 0) {
      this.totaisMes.totalGeral = totalGeral;
      this.totaisMes.quantidadeGeral = quantidadeGeral;
    }
  }

  public visualizarExtratoAnualDeEntradasPorProduto(){
    this.router.navigate([`/entrada-extrato-anual/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`]);
  }

  voltar() {
    this.router.navigate([`/detalhamento-cliente/${this.cdCliente}/${this.nomeCliente}/${this.dataRecebida}`]);
  }

}

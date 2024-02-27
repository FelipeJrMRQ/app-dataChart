import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ExcelService } from 'src/app/services/excel.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { ExtratoBeneficiamento } from 'src/app/models/extratos/extrato-beneficiamento';

@Component({
  selector: 'app-extrato-beneficiamento-anual',
  templateUrl: './extrato-beneficiamento-anual.component.html',
  styleUrls: ['./extrato-beneficiamento-anual.component.css']
})
export class ExtratoBeneficiamentoAnualComponent implements OnInit {

  public nomeCliente: any;
  public cdCliente: any;
  public dataRecebida: any;
  public nomeBeneficiamento = "";
  private nomeTela = 'faturamento-extrato-anual';
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  private modeloConsulta: ModeloConsulta;
  private extrato: ExtratoBeneficiamento[] = [];
  colunasTabela: any = [];
  dados: any = [];
  dadosFiltro: any = [];
  exportarDadosExcel: boolean = true;
  visualizarDetalhesDoProduto: boolean = true;
  dialogRef: any;
  meses: any = [];
  visualizarQtde: string = ''
  visualizaValor: string = 'd-none'
  nomeBtn: string = "valor";
  ordenacaoAscendente: boolean = false;
  pagina: any = 1;
  itensPagina: any = 20;
  totaisMes: any = [];
  valorA: any = 0;
  valorB: any = 0;
  totalA: any = 0;
  totalB: any = 0;

  constructor(
    private router: Router,
    private faturamentoService: FaturamentoService,
    private activeRoute: ActivatedRoute,
    private dialogo: MatDialog,
    private excelService: ExcelService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
    private snackBar: MatSnackBar,
  ) {
    this.modeloConsulta = new ModeloConsulta();
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA EXTRATO ANUAL FATURAMENTO ', 'EXTRATO ANUAL FATURAMENTO');
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
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('visualizar_detalhes_produto', this.nomeTela)
    }).subscribe({
      next: ({ s1, s2 }) => {
        this.exportarDadosExcel = s1;
        this.visualizarDetalhesDoProduto == s2;
      },
      complete: () => {
        this.consultarExtratoAnualDeFaturamentoPorBeneficiamentoDoCliente();
      },
      error: (e) => {
      }
    });
  }

  public visualizarExtratoAnualDeFaturamentoPorProduto() {
    this.router.navigate([`faturamento-extrato-anual/cliente/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}`])
  }

  public consultarExtratoAnualDeFaturamentoPorBeneficiamentoDoCliente() {
    let dataInicial = moment(moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).format('yyyy-MM-DD');
    this.faturamentoService.consultaExtratoAnualDeFaturamentoPorBeneficiamentoDoCliente(
      this.modeloConsulta.getInstance(dataInicial, this.dataRecebida, '', '', this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.extrato = res;
      },
      complete: () => {
        this.montarColunasParaTabela();
      }
    });
  }

  public consultarFaturamentoAnualDeProdutosDoCliente() {
    this.dados = [];
    this.meses = [];
    this.dadosFiltro = [];
    this.extrato = [];
    this.colunasTabela = [];
    let dataInicial = moment(moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).format('yyyy-MM-DD');
    this.faturamentoService.consultaExtratoAnualDeFaturamentoPorProdutoDoCliente(
      this.modeloConsulta.getInstance(dataInicial, this.dataRecebida, '', '', this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.extrato = res;
      },
      complete: () => {
        this.montarColunasParaTabela();
      }
    });
  }

  private montarColunasParaTabela() {
    let data = moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(12, 'months').format('yyyy-MM-DD');
    while (moment(data).isBefore(this.dateService.getInicioDoMes(this.dataRecebida))) {
      data = moment(data).add(1, 'month').format('yyyy-MM-DD');
      this.colunasTabela.push(moment(data).format('M-YY'));
      this.meses.push({ 'mesAno': `${moment(data).format('M-YY')}`, 'valor': 0, 'quantidade': 0 });
    }
    this.prepararDadosParaExibicao();
  }

  private prepararDadosParaExibicao() {
    this.extrato.forEach(e => {
      let dataTemp = {
        'cdBeneficiamento': e.cdBeneficiamento,
        'nomeBeneficiamento': e.nomeBeneficiamento,
        'totalQtd': 0,
        'totalValor': 0,
        'meses': [...this.meses.map((mes: any) => ({ ...mes }))]
      }
      if (!this.dados.some((dt: any) => dt.nomeBeneficiamento == e.nomeBeneficiamento)) {
        this.dados.push(dataTemp);
      }
    });
    this.preencherValoresDosMeses();
  }

  public visualizarProdutosDoBeneficiamento(cdBeneficamento: any) {
    this.router.navigate([`faturamento-extrato-anual-beneficiamento/produto/${this.dataRecebida}/${this.cdCliente}/${this.nomeCliente}/${cdBeneficamento}`])
  }

  private preencherValoresDosMeses() {
    this.dados.forEach((dt: any) => {
      dt.meses.forEach((mes: any) => {
        let benef = this.extrato.find((p: any) => p.nomeBeneficiamento == dt.nomeBeneficiamento && p.mes == mes.mesAno.split('-')[0]);
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
      this.nomeBtn = 'valor'
    } else {
      this.visualizarQtde = 'd-none';
      this.visualizaValor = '';
      this.nomeBtn = 'quantidade'
    }
  }

  public filtrarDadosPorProduto() {
    let temp = this.dados.filter((d: any) => {
      return d.nomeBeneficiamento.includes(this.nomeBeneficiamento.toUpperCase());
    });
    if (temp.length == 0) {
      temp = [{ nomeBeneficiamento: 'BENEFICIAMENTO NÃO ENCONTRADO.' }]
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
        let benef = this.dadosFiltro.find((b: any) => b.cdBeneficiamento == beneficiamento.cdBeneficiamento);
        if (benef) {
          benef.meses.forEach((b: any) => {
            if (this.visualizarQtde == '') {
              obj[b.mesAno] = b.quantidade;//Exporta dados por quantidade
            } else {
              obj[b.mesAno] = b.valor; //Exporta dados por valor
            }
          });
        }
        dataExport.push(obj);
      });
      this.excelService.geradorExcell(dataExport, 'extrato_faturamento_');
    } else {
      this.openSnackBar('Você não possui permissão de acesso a exportação de dados.', this.snackBarErro);
    }
  }

  public exibirDetalhesDoProduto(cdProduto: any) {
    if (this.visualizarDetalhesDoProduto) {
      this.dialogRef = this.dialogo.open(DlgFatMensalProdutoComponent, {
        data: {
          cdProduto
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

  voltar() {
    this.router.navigate([`/detalhamento-cliente/${this.cdCliente}/${this.nomeCliente}/${this.dataRecebida}`]);
  }

}

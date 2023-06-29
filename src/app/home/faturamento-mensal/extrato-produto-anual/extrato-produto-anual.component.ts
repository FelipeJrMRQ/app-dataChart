import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MesQuantidade } from 'src/app/models/extratos/extrato-mes-quantidade';
import { ExtratoProduto } from 'src/app/models/extratos/extrato-produto';
import { ExtratoProdutoAnual } from 'src/app/models/extratos/extrato-produto-anual';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { ExtratoModelo } from './extrado-modelo';
import { MatDialog } from '@angular/material/dialog';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { ExcelService } from 'src/app/services/excel.service';
import { ExtratoAnualExportData } from './export-data';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { elementAt, forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-extrato-produto-anual',
  templateUrl: './extrato-produto-anual.component.html',
  styleUrls: ['./extrato-produto-anual.component.css']
})
export class ExtratoProdutoAnualComponent implements OnInit {
  public extrato: ExtratoProdutoAnual[] = [];
  public extratoFiltro: ExtratoProdutoAnual[] = []
  public colunasTabela: any = [];
  public tbl: ExtratoProduto[] = [];
  private modeloConsulta: ModeloConsulta;
  private exportData: ExtratoAnualExportData;
  private dadosExcel: any = [];
  public tbQuantidade: string = "";
  public tbValor: string = "d-none";
  public isValor: boolean = false;
  public nomeCliente: any;
  public cdCliente: any;
  public dataRecebida: any;
  dialogRef: any;
  public btnValue: any = "Quantidade";
  public exportarDados: boolean = false;
  public visualizaDetalhesProduto: boolean = false;

  public totalGeralQtd: number = 0;
  public totalGeralVl: number = 0;
  public valorUnitario: number = 0;
  public totalMes: any = [];
  public pagina: number = 1;
  public itensPagina: number = 30;
  public nomeProduto = "";
  public extratoModelo: ExtratoModelo[] = [];
  public meses: any = [];
  private nomeTela = 'faturamento-extrato-anual'


  constructor(
    private service: FaturamentoService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private dialogo: MatDialog,
    private excelService: ExcelService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.exportData = new ExtratoAnualExportData();
    this.extrato = [];
    this.modeloConsulta = new ModeloConsulta();
    this.totalMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA EXTRATO ANUAL FATURAMENTO');
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
        this.exportarDados = s1;
        this.visualizaDetalhesProduto = s2;
      },
      complete:()=>{
        this.consultaExtratoAnualDeProdutosPorCliente();
      },
      error:(e)=>{
        console.log(e);
      }
    });
  }

  public filtarPorProduto() {
    this.extratoFiltro = [];
    if (this.nomeProduto != '') {
      this.extratoFiltro = this.extrato.filter(prod => {
        return prod.nomeProduto?.includes(this.nomeProduto.toUpperCase());
      });
      this.calcularTotalInteiroFiltro()
      this.calcularTotalPorMesFiltro();
    } else {
      this.extratoFiltro = [];
      this.consultaExtratoAnualDeProdutosPorCliente();
    }
  }

  public calcularTotalInteiroFiltro(){
    this.totalGeralQtd = 0;
    this.totalGeralVl = 0;
    this.extratoFiltro.forEach(e=>{
     this.totalGeralQtd += e.qtdeTotal;
     this.totalGeralVl += e.valorTotal;
    })
  }

  public valorTotal(valor: any) {
    return valor += valor;
  }

  public exportarPlanilha() {
    this.dadosExcel = [];
    this.extrato.forEach(e => {
      this.exportData = new ExtratoAnualExportData();
      this.exportData.PRODUTO = e.nomeProduto;
      this.exportData.CLIENTE = this.nomeCliente;
      this.exportData.BENEFICIAMENTO = e.nomeBeneficiamento;
      e.meses.forEach(m => {
        switch (m.mes) {
          case 1:
            if (this.isValor) {
              this.exportData.JAN = m.valor;
            } else {
              if (this.isValor) {
                this.exportData.JAN = m.valor;
              } else {
                this.exportData.JAN = m.quantidade;
              }
            }
            break;
          case 2:
            if (this.isValor) {
              this.exportData.FEV = m.valor;
            } else {
              this.exportData.FEV = m.quantidade;
            }
            break;
          case 3:
            if (this.isValor) {
              this.exportData.MAR = m.valor;
            } else {
              this.exportData.MAR = m.quantidade;
            }
            break;
          case 4:
            if (this.isValor) {
              this.exportData.ABR = m.valor;
            } else {
              this.exportData.ABR = m.quantidade;
            }
            break;
          case 5:
            if (this.isValor) {
              this.exportData.MAI = m.valor;
            } else {
              this.exportData.MAI = m.quantidade;
            }
            break;
          case 6:
            if (this.isValor) {
              this.exportData.JUN = m.valor;
            } else {
              this.exportData.JUN = m.quantidade;
            }
            break;
          case 7:
            if (this.isValor) {
              this.exportData.JUL = m.valor;
            } else {
              this.exportData.JUL = m.quantidade;
            }
            break;
          case 8:
            if (this.isValor) {
              this.exportData.AGO = m.valor;
            } else {
              this.exportData.AGO = m.quantidade;
            }
            break;
          case 9:
            if (this.isValor) {
              this.exportData.SET = m.valor;
            } else {
              this.exportData.SET = m.quantidade;
            }
            break;
          case 10:
            if (this.isValor) {
              this.exportData.OUT = m.valor;
            } else {
              this.exportData.OUT = m.quantidade;
            }
            break;
          case 11:
            if (this.isValor) {
              this.exportData.NOV = m.valor;
            } else {
              this.exportData.NOV = m.quantidade;
            }
            break;
          case 12:
            if (this.isValor) {
              this.exportData.DEZ = m.valor;
            } else {
              this.exportData.DEZ = m.quantidade;
            }
            break;
          default:
            break;
        }
      });
      this.dadosExcel.push(this.exportData);
    });
    let fileName = `${this.colunasTabela[0]}_A_${this.colunasTabela[11]}`;
    this.excelService.geradorExcell(this.dadosExcel, `historico_anual_${fileName}`);
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DO EXTRATO ANUAL FATURAMENTO');
  }


  public consultaExtratoAnualDeProdutosPorCliente() {
    let dataInicial = moment(moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).format('yyyy-MM-DD');
    this.service.consultaFaturamentoAnualProduto(
      this.modeloConsulta.getInstance(dataInicial, this.dataRecebida, '', '', this.cdCliente)
    ).subscribe({
      next: (res) => {
        this.tbl = res;
      },
      complete: () => {
        this.criarModeloDeExibicao();
      }
    });
  }

  public alterarModoDeVisualizacao() {
    if (this.isValor) {
      this.isValor = false;
      this.btnValue = 'Quantidade';
    } else {
      this.isValor = true;
      this.btnValue = 'Valor';
    }
    this.calcularTotalPorProduto();
  }

  public valorClass(valor: number) {
    if (valor == 0) {
      return "text-danger";
    } else {
      return "bold";
    }
  }

  /**
   * Cria o esqueleto do modelo de exibição inicial sendo auxiliado em seguida por 
   * métodos complementares que permitem a correta visualização dos dados.
   */
  public criarModeloDeExibicao() {
    this.colunasTabela = [];
    this.extrato = [];
    this.gerarColunasTabela();
    this.tbl.forEach(e => {
      this.gerarOrdenacaoMesesDoAnoNoArray();
      if (this.consultaProdutoNoArray(e.cdProduto) == undefined) {
        this.extrato.push(new ExtratoProdutoAnual(
          e.cdProduto,
          e.nomeProduto,
          e.nomeBeneficiamento,
          e.valor,
          this.meses,
        ));
      }
    });
    this.preencherProducaoDosMeses();
  }

  /**
   * Inicialmente os valores de produção do extrato estão zerados após sua criação inicial,
   * por este motivo é feita uma nova iteração sobre o array e quando identificado 
   * o mês correspondente seus valores serão devidamento preenchidos
   */
  public preencherProducaoDosMeses() {
    this.totalGeralQtd = 0;
    this.totalGeralVl = 0;
    this.tbl.forEach(e => {
      this.consultaProdutoNoArray(e.cdProduto)?.meses.forEach(m => {
        if (e.mes === m.mes) {
          this.totalGeralVl += e.valor;
          this.totalGeralQtd += e.quantidade;
          m.quantidade = e.quantidade;
          m.valor = e.valor;
          m.ano = e.ano;
        }
      });
    });
    this.calcularTotalPorProduto();
  }
  

  public calcularTotalPorProduto() {
    this.extrato.forEach(e => {
      e.valorTotal = 0;
      e.meses.forEach(m => {
        e.valorTotal += m.valor;
        e.qtdeTotal += m.quantidade;
      });
    });
    this.calcularTotalPorMes();
  }

  public calcularTotalPorMes() {
    this.dadosExcel = [];
    this.totalMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.extrato.forEach(e => {
      e.meses.forEach(m => {
        let index = e.meses.findIndex(e => e.mes == m.mes)
        switch (m.mes) {
          case 1:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 2:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 3:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 4:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 5:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 6:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 7:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 8:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 9:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 10:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 11:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 12:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          default:
            break;
        }
      });
    })
  }


  public calcularTotalPorMesFiltro() {
    this.dadosExcel = [];
    this.totalMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    this.extratoFiltro.forEach(e => {
      e.meses.forEach(m => {
        let index = e.meses.findIndex(e => e.mes == m.mes)
        switch (m.mes) {
          case 1:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 2:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 3:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 4:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 5:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 6:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 7:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 8:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 9:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 10:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 11:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          case 12:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade
            }
            break;
          default:
            break;
        }
      });
    })
  }






  /**
   * Utilizado para checar se o produto já existe no array 
   * podendo assim evitar duplicidade e valores imprecisos
   * 
   * @param cdProduto 
   * @returns 
   */
  public consultaProdutoNoArray(cdProduto: any) {
    return this.extrato.find(c => {
      return c.cdProduto == cdProduto;
    });
  }

  public voltar() {
    this.router.navigate([`detalhamento-cliente/${this.cdCliente}/${this.nomeCliente}/${this.dataRecebida}`]);
  }

  /**
   * Criar um modelo de ordenação no array com base na data atual sempre com uma 
   * visão de produtividade de 11 meses anteriores nunca repetindo e mês atual
   * no ano anterior exemplo:
   * 
   * 2022-03
   * 2022-04
   * 2022-05
   * 2022-06
   * 2022-07
   * 2022-08
   * 2022-09
   * 2022-10
   * 2022-11
   * 2022-12
   * 2023-01
   * 2023-02 
   */
  public gerarOrdenacaoMesesDoAnoNoArray() {
    this.meses = [];
    for (let index = 0; index < 12; index++) {
      let data = moment(moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).add(index, 'month').format('yyyy-MM-DD');
      this.criarArrayMesesDoAno(moment(data).month(), moment(data).year());
    }
  }

  public criarArrayMesesDoAno(mes: number, ano: number) {
    if (mes == 0 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 1, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 1 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 2, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 2 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 3, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 3 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 4, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 4 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 5, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 5 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 6, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 6 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 7, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 7 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 8, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 8 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 9, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 9 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 10, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 10 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 11, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    } else if (mes == 11 && ano < moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 12, ano: (moment(this.dataRecebida).year() - 1), quantidade: 0, valor: 0 });
    }
    if (mes == 0 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 1, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 1 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 2, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 2 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 3, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 3 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 4, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 4 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 5, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 5 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 6, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 6 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 7, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 7 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 8, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 8 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 9, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 9 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 10, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 10 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 11, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    } else if (mes == 11 && ano == moment(this.dataRecebida).year()) {
      this.meses.push({ mes: 12, ano: (moment(this.dataRecebida).year()), quantidade: 0, valor: 0 });
    }
  }

  /**
   * Criar um modelo de ordenação no array com base na data atual sempre com uma 
   * visão de produtividade de 11 meses anteriores nunca repetindo e mês atual
   * no ano anterior exemplo:
   * 
   * MAR-22
   * ABR-22
   * MAI-22
   * JUN-22
   * JUL-22
   * AGO-22
   * SET-22
   * OUT-22
   * NOV-22
   * DEZ-22
   * JAN-23
   * FEV-23 
   * 
   */
  public gerarColunasTabela() {
    for (let index = 0; index < 12; index++) {
      let data = moment(moment(this.dateService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).add(index, 'month').format('yyyy-MM-DD');
      this.montarColunas(moment(data).month(), moment(data).year());
    }
  }

  public montarColunas(mes: number, ano: number) {
    if (mes == 0 && ano < moment().year()) {
      this.colunasTabela.push(`JAN-${moment().year(ano).format('YY')}`);
    } else if (mes == 1 && ano < moment().year()) {
      this.colunasTabela.push(`FEV-${moment().year(ano).format('YY')}`);
    } else if (mes == 2 && ano < moment().year()) {
      this.colunasTabela.push(`MAR-${moment().year(ano).format('YY')}`);
    } else if (mes == 3 && ano < moment().year()) {
      this.colunasTabela.push(`ABR-${moment().year(ano).format('YY')}`);
    } else if (mes == 4 && ano < moment().year()) {
      this.colunasTabela.push(`MAI-${moment().year(ano).format('YY')}`);
    } else if (mes == 5 && ano < moment().year()) {
      this.colunasTabela.push(`JUN-${moment().year(ano).format('YY')}`);
    } else if (mes == 6 && ano < moment().year()) {
      this.colunasTabela.push(`JUL-${moment().year(ano).format('YY')}`);
    } else if (mes == 7 && ano < moment().year()) {
      this.colunasTabela.push(`AGO-${moment().year(ano).format('YY')}`);
    } else if (mes == 8 && ano < moment().year()) {
      this.colunasTabela.push(`SET-${moment().year(ano).format('YY')}`);
    } else if (mes == 9 && ano < moment().year()) {
      this.colunasTabela.push(`OUT-${moment().year(ano).format('YY')}`);
    } else if (mes == 10 && ano < moment().year()) {
      this.colunasTabela.push(`NOV-${moment().year(ano).format('YY')}`);
    } else if (mes == 11 && ano < moment().year()) {
      this.colunasTabela.push(`DEZ-${moment().year(ano).format('YY')}`);
    }
    if (mes == 0 && ano == moment().year()) {
      this.colunasTabela.push(`JAN-${moment().year(ano).format('YY')}`);
    } else if (mes == 1 && ano == moment().year()) {
      this.colunasTabela.push(`FEV-${moment().year(ano).format('YY')}`);
    } else if (mes == 2 && ano == moment().year()) {
      this.colunasTabela.push(`MAR-${moment().year(ano).format('YY')}`);
    } else if (mes == 3 && ano == moment().year()) {
      this.colunasTabela.push(`ABR-${moment().year(ano).format('YY')}`);
    } else if (mes == 4 && ano == moment().year()) {
      this.colunasTabela.push(`MAI-${moment().year(ano).format('YY')}`);
    } else if (mes == 5 && ano == moment().year()) {
      this.colunasTabela.push(`JUN-${moment().year(ano).format('YY')}`);
    } else if (mes == 6 && ano == moment().year()) {
      this.colunasTabela.push(`JUL-${moment().year(ano).format('YY')}`);
    } else if (mes == 7 && ano == moment().year()) {
      this.colunasTabela.push(`AGO-${moment().year(ano).format('YY')}`);
    } else if (mes == 8 && ano == moment().year()) {
      this.colunasTabela.push(`SET-${moment().year(ano).format('YY')}`);
    } else if (mes == 9 && ano == moment().year()) {
      this.colunasTabela.push(`OUT-${moment().year(ano).format('YY')}`);
    } else if (mes == 10 && ano == moment().year()) {
      this.colunasTabela.push(`NOV-${moment().year(ano).format('YY')}`);
    } else if (mes == 11 && ano == moment().year()) {
      this.colunasTabela.push(`DEZ-${moment().year(ano).format('YY')}`);
    }
  }

  public sortMes(sort: Sort) {
    let indiceDoArray = this.colunasTabela.findIndex((e: any) => e == sort.active);
    let data = this.extrato
    if (!sort.active || sort.direction === '') {
      this.extrato = data;
      return;
    }
    this.extrato = data.sort((a, b) => {
      const isAsc = sort.direction === 'desc';
      switch (indiceDoArray) {
        case indiceDoArray:
          if (this.isValor) {
            return this.compare(a.meses[indiceDoArray].valor, b.meses[indiceDoArray].valor, isAsc);
          } else {
            return this.compare(a.meses[indiceDoArray].quantidade, b.meses[indiceDoArray].quantidade, isAsc);
          }
        default:
          return 0;
      }
    });
  }

  public compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? - 1 : 1) * (isAsc ? 1 : -1);
  }

  public openDetalhesProduto(produto: any) {
    if(this.visualizaDetalhesProduto){
      this.dialogRef = this.dialogo.open(DlgFatMensalProdutoComponent, {
        data: {
          nomeCliente: this.nomeCliente,
          cdProduto: produto.cdProduto,
          nomeProduto: produto.nomeProduto,
          nomeBeneficiamento: produto.nomeBeneficiamento,
          valorUnitario: (produto.valorTotal / produto.qtdeTotal),
          quantidade: produto.qtdeTotal,
          valor: produto.valorTotal,
        },
        maxHeight: '95vh',
      });
    }
  }
}




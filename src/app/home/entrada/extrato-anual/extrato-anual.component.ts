import { ExtratoAnualExportData } from './../../faturamento-mensal/extrato-produto-anual/export-data';
import { ExcelService } from './../../../services/excel.service';
import { MatDialog } from '@angular/material/dialog';
import { ExtratoProdutoAnual } from 'src/app/models/extratos/extrato-produto-anual';

import { ExtratoProduto } from 'src/app/models/extratos/extrato-produto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

import { EntradaService } from 'src/app/services/entrada.service';
import { Sort } from '@angular/material/sort';
import { DlgFatMensalProdutoComponent } from 'src/app/shared/dialog/dlg-fat-mensal-produto/dlg-fat-mensal-produto.component';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';


@Component({
  selector: 'app-extrato-anual',
  templateUrl: './extrato-anual.component.html',
  styleUrls: ['./extrato-anual.component.css']
})
export class ExtratoAnualComponent implements OnInit {

  dataSelecionada: any;
  dataRecebida: any;
  cdCliente: any;
  nomeCliente: any;
  public colunasTabela: any = []
  public meses: any = [];
  public totalGeralQtd = 0;
  public totalGeralVl = 0;
  public totalMes: any = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  isValor: any;
  btnValue: any;
  nomeProduto = "";
  dialogRef: any;
  pagina: number = 1;
  itensPagina: number = 30;
  tbl: ExtratoProduto[] = [];
  extrato: ExtratoProdutoAnual[] = [];
  exportData: ExtratoAnualExportData;
  dadosExcel: any = [];
  private visualizarDetalhesProduto: boolean = false;
  public exportarDados: boolean = false;
  private nomeTela: string  = "entrada-extrato-anual";


  constructor(
    private activeRouter: ActivatedRoute,
    private router: Router,
    private entradaService: EntradaService,
    private dialogo: MatDialog,
    private excelService: ExcelService,
    private dataService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService
  ) {

    this.exportData = new ExtratoAnualExportData();

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
      this.exportarDados = s2;
      this.activeRouter.params.subscribe((res: any) => {
        this.dataRecebida = res.data;
        this.cdCliente = res.cdCliente;
        this.nomeCliente = res.nomeCliente;
        this.consultaExtratoAnual();
        this.btnValue = 'Quantidade';
        this.isValor = false;
      });
    })
  }

  // public voltar() {
  //   this.router.navigate([`entrada-produto/${this.cdCliente}/${this.dataRecebida}/${this.nomeCliente}`]);
  // }

  public voltar() {
    this.router.navigate([`detalhamento-cliente/${this.cdCliente}/${this.nomeCliente}/${this.dataRecebida}`]);
  }

  public consultaExtratoAnual() {
    let dataInicial = moment(this.dataService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months').format('yyyy-MM-DD');
    this.entradaService.consultaExtratoAnualDeEntradasDoCliente(dataInicial, this.dataRecebida, this.cdCliente).subscribe({
      next: (res) => {
        this.tbl = res
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.preencherDadosExibicao()
      }
    });
  }

  public valorClass(valor: number) {
    if (valor == 0) {
      return "text-danger";
    } else {
      return "bold";
    }
  }

  public alterarModoDeVisualizacao() {
    if (this.isValor == false) {
      this.isValor = true;
      this.pagina = 1;
      this.btnValue = "Valor";
    } else {
      this.isValor = false;
      this.pagina = 1;
      this.btnValue = "Quantidade"
    }
    this.calcularTotalPorMes();
    this.calcularTotalPorProduto();
  }


  public buscarProdutoNoArray(cdProduto: any) {
    return this.extrato.find(c => {
      return c.cdProduto == cdProduto
    });
  }

  public preencherDadosExibicao() {
    this.colunasTabela = [];
    this.extrato = [];
    this.gerarColunasTabelas();
    this.tbl.forEach(e => {
      this.gerarOrdenacaoMesesDoAnoArrayEntrada();
      if (this.buscarProdutoNoArray(e.cdProduto) == undefined) {
        this.extrato.push(new ExtratoProdutoAnual(
          e.cdProduto,
          e.nomeProduto,
          e.nomeBeneficiamento,
          e.valor,
          this.meses,
        ));
      }
    });
    this.preencherProdutosEntradasMeses();

  }


  public preencherProdutosEntradasMeses() {
    this.totalGeralQtd = 0;
    this.totalGeralVl = 0;
    this.tbl.forEach(e => {
      this.buscarProdutoNoArray(e.cdProduto)?.meses.forEach(m => {
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
      e.qtdeTotal = 0;
      e.meses.forEach(m => {
        e.valorTotal += m.valor;
        e.qtdeTotal += m.quantidade;
      });
    });
    this.calcularTotalPorMes();
  }

  public calcularTotalPorMes() {
    this.totalMes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.extrato.forEach(e => {
      e.meses.forEach(m => {
        let index = e.meses.findIndex(e => e.mes == m.mes);
        switch (m.mes) {
          case 1:
            if (this.isValor) {
              this.totalMes[index] = this.totalMes[index] += m.valor;
            } else {
              this.totalMes[index] = this.totalMes[index] += m.quantidade;
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
      })
    });
  }

  public gerarColunasTabelas() {
    for (let index = 0; index < 12; index++) {
      let data = moment(moment(this.dataService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).add(index, 'month').format('yyyy-MM-DD');
      this.montarColunas(moment(data).month(), moment(data).year());
    }
  }

  public gerarOrdenacaoMesesDoAnoArrayEntrada() {
    this.meses = [];
    for (let index = 0; index < 12; index++) {
      let data = moment(moment(this.dataService.getInicioDoMes(this.dataRecebida)).subtract(11, 'months')).add(index, 'month').format('yyyy-MM-DD');
      this.criarArrayMesesDoAno(moment(data).month(), moment(data).year());
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


  public criarArrayMesesDoAno(mes: number, ano: number) {
    if (mes == 0 && ano < moment(this.dataRecebida).year()){
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


  public filtarPorProduto() {
    if (this.nomeProduto != '') {
      this.extrato = this.extrato.filter(prod => {
        return prod.nomeProduto?.includes(this.nomeProduto.toUpperCase());
      });
    } else {
      this.consultaExtratoAnual();
    }
  }

  public openDetalhesProduto(produto: any) {
   if(this.visualizarDetalhesProduto){
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

  public exportarPanilha() {
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
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DO EXTRATO ANUAL ENTRADAS', '');
  }


}

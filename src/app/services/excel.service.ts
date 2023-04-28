import { BeneficiamentoDiarioExport } from './../models/exports/beneficiamento-diario-export';
import { FaturamentoBeneficiamento } from '../models/faturamento/faturamento-beneficiamento';
import { BeneficiamentoMensalExport } from '../models/exports/beneficiamento-Mensal-export';
import { ClienteExport } from './../models/exports/cliente-export';
import { FaturamentoMensalProduto } from './../models/faturamento/faturamento-mensal-produto';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ProdutoExport } from '../models/exports/produto-export';
import { FaturamentoMensalCliente } from '../models/faturamento/faturamento-mensal-cliente';
import { FaturamentoMensalBeneficiamento } from '../models/faturamento/faturamento-mensal-beneficiamento';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {


  constructor() { }

  //METODO PARA GERAR O ARQUIVO NO FORMATO EXCEL 
  public geradorExcell(json: any[], excelFile: string): void {
    const sheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const book: XLSX.WorkBook = { Sheets: { 'data': sheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(book, { bookType: 'xlsx', type: 'array' });
    this.saveFile(excelBuffer, excelFile);
  }

  private saveFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + "_" + moment().format('DDMMyyyy') + EXCEL_EXTENSION);
  }



  //GERADORES EXCEL MENSAL 
  public gerarExportCliente(clientes: FaturamentoMensalCliente[], nome: string) {
    let listaCliente: ClienteExport[] = [];
    clientes.forEach((c) => {
      let clienteExport = new ClienteExport();
      clienteExport.CLIENTE = c.nomeCliente;
      clienteExport.VALOR = c.valor;
      listaCliente.push(clienteExport);
    });
    this.geradorExcell(listaCliente, nome);
  }


  public gerarExportBeneficiamento(beneficiamento: FaturamentoMensalBeneficiamento[], nome: string) {
    let listaBeneficiamento: BeneficiamentoMensalExport[] = [];
    beneficiamento.forEach((b) => {
      let beneficimentoExport = new BeneficiamentoMensalExport();
      beneficimentoExport.BENEFICIAMENTO = b.nomeBeneficiamento;
      beneficimentoExport.VALOR = b.valor;
      listaBeneficiamento.push(beneficimentoExport)
    });
    this.geradorExcell(listaBeneficiamento, nome)
  }

  public gerarExportProduto(produtos: FaturamentoMensalProduto[], nome: string) {
    let listaProduto: ProdutoExport[] = [];
    produtos.forEach((p) => {
      let produtoExport = new ProdutoExport();
      produtoExport.CLIENTE = p.nomeCliente;
      produtoExport.PRODUTO = p.nomeProduto;
      produtoExport.BENEFICIAMENTO = p.nomeBeneficiamento;
      produtoExport.AREA = p.area;
      produtoExport.QUANTIDADE = p.quantidade;
      produtoExport.VALOR = p.valor;
      listaProduto.push(produtoExport);
    });
    this.geradorExcell(listaProduto, nome)
  }


  //GERANDO EXCEL DIARIOS
  // CRIEI O BENEFICIAMENTO DIARIO POIS OS DOIS SÃO DADOS DIFERENTES E VÃO SE REPETIR EM MUITAS TABELAS POREM O DIARIO SE 
  // REPETE NAS CONSULTAS DIARIAS E O OUTRO BENEFICIAMENTO MENSAL SE REPETE SO DENTRO DO MENSAL POREM OS DADOS SÃO DIFENTE.
  // DEIXEI UM EXEMPLO FEITO TESTA E VE OQUE ACHA  FATURAMENTO/ ESCOLHE BENEFICIAMENTO E EXPORTA UM DEPOIS, CLICA NO CLIENTE ATE O FINAL.
  public gerarExportBeneficiamentoDiario(beneficiamento: FaturamentoBeneficiamento[], nome: string) {
    let listaBeneficimentoD: BeneficiamentoDiarioExport[] = [];
    beneficiamento.forEach((b) => {
      let beneficiamentoDiarioExport = new BeneficiamentoDiarioExport();
      beneficiamentoDiarioExport.DATA = b.data;
      beneficiamentoDiarioExport.BENEFICIAMENTO = b.nomeBeneficiamento;
      beneficiamentoDiarioExport.QUANTIDADE = b.quantidade;
      beneficiamentoDiarioExport.AREA = b.area;
      beneficiamentoDiarioExport.VALOR = b.valor;
      beneficiamentoDiarioExport.DATA = moment(beneficiamentoDiarioExport.DATA).format("DD/MM/yyyy");
      listaBeneficimentoD.push(beneficiamentoDiarioExport);
    });
    this.geradorExcell(listaBeneficimentoD, nome);
  }

}



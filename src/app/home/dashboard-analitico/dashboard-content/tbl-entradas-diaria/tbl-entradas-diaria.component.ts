import { EntradaExport } from './../../../../models/exports/entrada-export';
import { ExcelService } from './../../../../services/excel.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { EntradaDiaria } from 'src/app/models/entrada/entrada-diaria';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { EntradaService } from 'src/app/services/entrada.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tbl-entradas-diaria',
  templateUrl: './tbl-entradas-diaria.component.html',
  styleUrls: ['./tbl-entradas-diaria.component.css']
})
export class TblEntradasDiariaComponent implements OnInit, OnDestroy {

  private intervalo: any;

  //grafico
  public elementChartB: any;
  public chartBEntrada: any = "";
  public labelEntrada: any = [];
  public dataEntrada: any = [];
  public labelEntradaS: any = [];
  public dataEntradaS: any = [];
  public dNone: any = "d-none";
  public dataType: boolean = false;

  //Listas
  public listaEntradas: EntradaDiaria[];
  public modeloConsulta: ModeloConsulta;

  //Valores
  valorTotalEntradas: number = 0;

  //Datas
  private dataRecebida: string = moment().format();

  //Controles paginação
  public itensPagina: number = 15;
  public paginaEntradaDia: number = 1;
  public exportarDados: boolean = false;

  //Variaveis de estilo
  public upDateOption: any = 'd-none'

  //Objetos
  private nomeTela = "dashboard-analitico";

  constructor(
    private entradaService: EntradaService,
    private exportDataService: ExcelService,
    private dateService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
    private router: Router
  ) {
    this.listaEntradas = [];
    this.modeloConsulta = new ModeloConsulta();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void {
    this.receberDataAtualizada();
    this.verificaPermissaoDeAcesso();
  }

  public receberDataAtualizada() {
    FaturamentoService.emitirData.subscribe(data => {
      this.dataRecebida = data;
      this.verificaPermissaoDeAcesso();
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados_entrada', this.nomeTela),
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      }, complete: () => {
        this.verificaSeOSistemaEstaAtualizando();
        this.consultarEntradasPorPeriodo();
      }, error: (e) => {
        console.log(e);
      }
    });
  }

  public verificaSeOSistemaEstaAtualizando() {
    if (this.intervalo == undefined) {
      this.intervalo = setInterval(() => {
        this.entradaService.isUpdateEntradas().subscribe({
          next: (res) => {
            if (res) {
              this.upDateOption = 'd-block';
            } else {
              this.upDateOption = 'd-none';
            }
          }
        })
      }, 3000);
    } else {
      clearInterval(this.intervalo);
    }
  }

  public consultarEntradasPorPeriodo() {
    this.entradaService.consultarEntradasPorPeriodo(
      this.modeloConsulta.getInstance(this.dateService.getInicioDoMes(this.dataRecebida), this.dataRecebida, "entrada-dia", '', undefined)
    ).subscribe({
      next: (res) => {
        this.listaEntradas = res.objeto;
      }, complete: () => {
        this.calcularTotalEntradaDia();
      }
    });
  }

  public calcularTotalEntradaDia() {
    this.valorTotalEntradas = 0;
    this.listaEntradas.forEach((e) => {
      this.valorTotalEntradas += e.valor;
    });
  }

  public gerarArquivoExportacao() {
    let listaEntrada: EntradaExport[] = [];
    this.listaEntradas.forEach((e) => {
      let listaExport = new EntradaExport();
      listaExport.VALOR = e.valor;
      listaExport.DATA = e.data;
      listaExport.DATA = moment(listaExport.DATA).format("DD/MM/yyyy");
      listaEntrada.push(listaExport);
    });
    this.exportDataService.geradorExcell(listaEntrada, "Entradas-diaria");
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DAS ENTRADAS DIARIAS');
  }

  /**
   * Ao clicar na linha da tabela o sistema redireciona o usuário
   * para os detalhes de entrada por cliente
   * 
   * @param data 
   */
  public consultarEntradasPorCliente(data: any) {
    this.router.navigate([`${'entrada/cliente'}/${data}`]);
    window.scrollTo(0, 0);
  }

  /**
   * Retorna o nome do dia da semana
   * @param dia 
   * @returns 
   */
  public verificaDiaDaSemana(dia: any) {
    return this.dateService.diaDaSemana(dia);
  }

}

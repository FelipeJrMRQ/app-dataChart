import { FaturamentoExport } from './../../../../models/exports/faturamento-export';
import { ExcelService } from './../../../../services/excel.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tbl-faturamento-diario',
  templateUrl: './tbl-faturamento-diario.component.html',
  styleUrls: ['./tbl-faturamento-diario.component.css']
})
export class TblFaturamentoDiarioComponent implements OnInit, OnDestroy {

  //Objetos
  private modeloConsulta: ModeloConsulta;
  public upDateOption: string = 'd-none'
  private intervalo: any;

  //Arrays
  public listaData: any = [];
  public listaValor: any = [];
  public listaMedia: any = [];
  public listaFaturamentoDiario: FaturamentoDiario[];

  //Datas
  private dataRecebida: string = moment().format();

  //Flags de controle
  public dataType: boolean = false;
  public itensPagina: number = 15;
  public paginaFaturamentoDiario: number = 1;
  exportarDados: boolean = false;

  //Valores
  public valorFatutamentoMes: number = 0;
  public mediaValor: number = 0;
  public mediaFaturamentoSemSabados: number = 0;

  //Estilos e cores
  public bgColor: string = "rgba(139, 0,0 )";
  public dNone: string = "d-none";

  private nomeTela = "dashboard-analitico";

  constructor(
    private faturamentoService: FaturamentoService,
    private exportDataService: ExcelService,
    private dateService: DateControllerService,
    private router: Router,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloConsulta = new ModeloConsulta();
    this.listaFaturamentoDiario = [];
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalo);
  }

  ngOnInit(): void {
    this.receberDataAtualizada();
    this.verificarPermissaoDeAcesso();
  }

  private receberDataAtualizada() {
    FaturamentoService.emitirData.subscribe(data => {
      this.dataRecebida = data;
      this.verificarPermissaoDeAcesso();
    });
  }

  private verificarPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('exportar_dados_faturamento', this.nomeTela),
    }).subscribe({
      next: ({ s1 }) => {
        this.exportarDados = s1;
      }, error: (e) => {
        console.log(e);
      }, complete: () => {
        this.verificaSeOSistemaEstaAtualizando();
        this.consultaFaturamentoDiario();
      }
    });
  }

  public verificaSeOSistemaEstaAtualizando() {
    if (this.intervalo == undefined) {
      this.intervalo = setInterval(() => {
        this.faturamentoService.isUpdateFaturamento().subscribe({
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

  public consultaFaturamentoDiario() {
    this.faturamentoService.consultaFaturamentoDiario(
      this.modeloConsulta.getInstance(this.dateService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format(), "faturamento-diario", "", undefined)).subscribe({
        next: (res) => {
          this.listaFaturamentoDiario = res.objeto;
        }, error: (e) => {
          console.log(e);
        }, complete: () => {
          this.calcularTotalDiario();
        }
      });
  }

  public calcularTotalDiario() {
    this.valorFatutamentoMes = 0;
    this.listaFaturamentoDiario.forEach((e) => {
      this.valorFatutamentoMes += e.valor;
    });
  }

  /**
   * Retorna o nome do dia da semana
   * @param dia 
   * @returns 
   */
  public verificaDiaDaSemana(dia: any) {
    return this.dateService.diaDaSemana(dia);
  }

  public gerarArquivoExportcao() {
    let listaFaturamento: FaturamentoExport[] = [];
    this.listaFaturamentoDiario.forEach((f) => {
      let listaExport = new FaturamentoExport();
      listaExport.VALOR = f.valor;
      listaExport.DATA = f.data;
      listaExport.DATA = moment(listaExport.DATA).format("DD/MM/yyyy");
      listaFaturamento.push(listaExport);
    });
    this.exportDataService.geradorExcell(listaFaturamento, "Faturamento-diario");
    this.controleExibicaoService.registrarLog('EXPORTOU DADOS DO FATURAMENTO DIARIO', '');
  }

  public navegarParaDetalhesFaturamentoPorCliente(data: any) {
    setTimeout(() => {
      this.router.navigate([`/faturamento-diario/${data.data}`]);
      window.scrollTo(0, 0);
    }, 100);
  }


}

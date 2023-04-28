import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { EntradaDiaria } from 'src/app/models/entrada/entrada-diaria';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { Usuario } from 'src/app/models/usuario';
import { EntradaService } from 'src/app/services/entrada.service';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-card-media',
  templateUrl: './card-media.component.html',
  styleUrls: ['./card-media.component.css']
})
export class CardMediaComponent implements OnInit {

  faturamentoDiario: FaturamentoDiario[] = [];
  entradas: EntradaDiaria[] = [];
  modeloDeConsulta: ModeloConsulta;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  valorTotalEntrada: any = 0;
  valorMediaEntrada: any = 0;
  valorMediaFaturamentoDiasUteis: any = 0;
  valorMediaFaturamentoComSabados: any = 0;
  diasUteisTrabalhados: any = 0;
  diasTrabalhosComSabados: any = 0;
  usuario: Usuario;
  feriadosDoMes: [] = [];
  valorFaturamento: number = 0;
  listaFaturamentoDiario: FaturamentoDiario[];
  parametrosMeta: ParametrosMeta;
  intervalo: any;
  btn = false;
  exibirMediaEntrada: boolean = false;
  exibirMediaFatComSabado: boolean = false;
  exibirMediaFatSemSabado: boolean = false;
  private nomeTela = "dashboard-sintetico";

  constructor(
    private usuarioService: UsuarioService,
    private entradaService: EntradaService,
    private faturamentoService: FaturamentoService,
    private dataService: DateControllerService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.modeloDeConsulta = new ModeloConsulta();
    this.usuario = new Usuario();
    this.listaFaturamentoDiario = [];
    this.parametrosMeta = new ParametrosMeta();
  }

  ngOnInit(): void {
    this.dataRecebida = moment().format("yyyy-MM-DD");
    this.verificaPermissaoDeAcesso();
    this.receberDataEscolhida();
  }


  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleExibicaoService.verificaPermissaoDeAcesso('media_entradas', this.nomeTela),
      s2: this.controleExibicaoService.verificaPermissaoDeAcesso('media_faturamento', this.nomeTela),
      s3: this.controleExibicaoService.verificaPermissaoDeAcesso('media_faturamento_sabado', this.nomeTela),
    }).subscribe(({ s1, s2, s3 }) => {
      this.exibirMediaEntrada = s1;
      this.exibirMediaFatSemSabado = s2;
      this.exibirMediaFatComSabado = s3;
      this.consultaFaturamentoDiario();
      this.consultaFeriadosDoMes();
    });
  }

  public receberDataEscolhida() {
    FaturamentoService.emitirData.subscribe((res) => {
      this.dataRecebida = res;
      this.verificaPermissaoDeAcesso();
    });
  }

  private consultaFeriadosDoMes() {
    this.dataService.consultaFeriadosDoMes(this.dataRecebida).subscribe({
      next: (res: any) => {
        this.feriadosDoMes = res;
      }, complete: () => {
        this.calculaDiasUteisTrabalhados();
      }
    });
  }

  public calculaDiasUteisTrabalhados() {
    this.diasUteisTrabalhados = 0;
    this.diasTrabalhosComSabados = 0;
    this.dataService.calculaDiasTrabalhados(this.dataRecebida).subscribe({
      next: (res) => {
        this.diasUteisTrabalhados = res;
      },
      complete: () => {
        this.consultarValorFaturamento(this.dataRecebida);
      }
    });
  }

  public consultarValorFaturamento(data: any) {
    /**
     * Remove um dia da data se ela for o dia corrente
     * Isso permite que a media de faturamento seja calculada
     * com base no faturamento do dia anterior
     */
    if (!this.dataService.isDataAnterior(data)) {
      data = moment(data).subtract(1, 'day').format('yyyy-MM-DD');
    }
    this.faturamentoService.consultaValorFaturamento(
      this.modeloDeConsulta.getInstance(
        this.dataService.getInicioDoMes(data),
        data,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.valorFaturamento = res.valorFaturamento;
      },
      complete: () => {
        this.calculaMediaDeFaturamentoDoMesDiasUteis();
        this.calculaMediaDeFaturamentoDoMesComSabados();
      }
    });
  }

  private calculaMediaDeFaturamentoDoMesDiasUteis() {
    this.consultaEntradas();
    this.valorMediaFaturamentoDiasUteis = 0;
    if (this.dataRecebida == moment(this.dataRecebida).startOf('month').format("yyyy-MM-DD") || this.diasUteisTrabalhados < 1) {
      this.valorMediaFaturamentoDiasUteis = 0.000001;
    } else {
      if (this.exibirMediaFatSemSabado) {
        this.valorMediaFaturamentoDiasUteis = (this.valorFaturamento / this.diasUteisTrabalhados);
      }
    }
  }

  private calculaMediaDeFaturamentoDoMesComSabados() {
    this.valorMediaFaturamentoComSabados = 0;
    if (this.dataRecebida == moment(this.dataRecebida).startOf('month').format("yyyy-MM-DD") || this.diasUteisTrabalhados < 1) {
      this.valorMediaFaturamentoComSabados = 0.00001;
    } else {
      if (this.exibirMediaFatComSabado) {
        let sabadosTrabalhados = 0;
        this.listaFaturamentoDiario.forEach(l => {
          if (this.sabado(l.data)) {
            sabadosTrabalhados++;
          }
        });
        this.valorMediaFaturamentoComSabados = (this.valorFaturamento / (this.diasUteisTrabalhados + sabadosTrabalhados));
      }
    }
  }

  public consultaEntradas() {
    this.entradas = [];
    this.entradaService.consultarEntradasPorPeriodo(
      this.modeloDeConsulta.getInstance(
        this.dataService.getInicioDoMes(this.dataRecebida),
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.entradas = res.objeto;
      },
      complete: () => {
        this.calcularMediaDeEntradasDoMes();
      }
    });
  }

  /**
   * Realiza o cálculo da média de entradas sempre eliminando do cálculo o dia atual
   */
  private calcularMediaDeEntradasDoMes() {
    this.valorMediaEntrada = 0;
    this.valorTotalEntrada = 0;
    let dias = 0;
    if (this.exibirMediaEntrada) {
      this.entradas.forEach((res: any) => {
        //Controla para que o dia atual não faça parte do cálculo  
        if (moment(res.data).format('yyyy-MM-DD') !== moment().format('yyyy-MM-DD').toString()) {
          this.valorTotalEntrada += res.valor;
          dias++;
        }
      });
      this.valorMediaEntrada = (this.valorTotalEntrada / dias);
    }
  }

  public consultaFaturamentoDiario() {
    this.faturamentoService.consultaFaturamentoDiario(
      this.modeloDeConsulta.getInstance(this.dataService.getInicioDoMes(this.dataRecebida), moment(this.dataRecebida).format(), "faturamento-diario", "", undefined)).subscribe({
        next: (res) => {
          this.listaFaturamentoDiario = res.objeto;
        }
      });
  }

  public sabado(data: any): boolean {
    return (moment(data).day() == 6);
  }
}

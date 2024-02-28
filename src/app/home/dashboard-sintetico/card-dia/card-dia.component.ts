import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as bootstrap from 'bootstrap';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { TelaUsuario } from 'src/app/models/tela/tela-usuario';
import { Usuario } from 'src/app/models/usuario';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { MetaDiariaService } from 'src/app/services/meta-diaria.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-card-dia',
  templateUrl: './card-dia.component.html',
  styleUrls: ['./card-dia.component.css']
})
export class CardDiaComponent implements OnInit {
  arrowGap: string;
  valorFaturamentoDia: number = 0;
  gapDoDia: number = 0;
  metaFaturamentoDoDia: number = 0;
  modeloDeConsulta: ModeloConsulta;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  faturamentoDiario: FaturamentoDiario[] = [];
  metaFaturamentoDoMes: number = 0;
  parametrosMeta: ParametrosMeta;
  percentualFaturamento: any = 0;
  bgColor: any = 'bg-color-chart-30';
  colorTextGapDia: any = 'text-danger';
  rotateChart: any = '45deg';
  usuario: Usuario;
  telasUsuario: TelaUsuario[];
  private nomeTela = "dashboard-sintetico";
  private toolTipElements: Element[] = [];
  private tooltips: bootstrap.Tooltip[] = [];


  // ###### Este componente pertence a tela dashboard-sintetico

  constructor(
    private faturamentoService: FaturamentoService,
    private dateService: DateControllerService,
    private parametrosService: ParametrosMetaService,
    private metaDiariaService: MetaDiariaService,
    private controleDeExibicao: ControleExibicaoService,
    private router: Router,
    private el: ElementRef
  ) {
    this.arrowGap = "text-danger fa-angle-double-down";
    this.modeloDeConsulta = new ModeloConsulta();
    this.parametrosMeta = new ParametrosMeta();
    this.usuario = new Usuario();
    this.telasUsuario = [];
  }

  ngOnInit(): void {
    this.receberDataEscolhida();
    this.verificaPermissaoDeAcesso();

  }

  ngAfterViewInit() {
    // Selecione os elementos com o atributo data-bs-toggle="tooltip"
    this.toolTipElements = [].slice.call(this.el.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));

    // Inicialize os tooltips
    this.tooltips = this.toolTipElements.map((tooltipTriggerEl: Element) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  ngOnDestroy(): void {
    // Destrua os tooltips ao sair da página
    this.tooltips.forEach(tooltip => {
      if (tooltip && typeof tooltip.dispose === 'function') {
        tooltip.dispose();
      }
    });
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleDeExibicao.verificaPermissaoDeAcesso('grafico_diario', this.nomeTela),
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultaValorFaturamento();
        return;
      }
      this.valorFaturamentoDia = 0;
      this.percentualFaturamento = 0;
      this.gapDoDia = 0;
    });
  }

  public receberDataEscolhida() {
    FaturamentoService.emitirData.subscribe((res: any) => {
      this.dataRecebida = res;
      this.verificaPermissaoDeAcesso();
    });
  }

  public consultaValorFaturamento() {
    this.faturamentoService.consultaFaturamentoDiario(
      this.modeloDeConsulta.getInstance(
        this.dateService.getInicioDoMes(this.dataRecebida),
        this.dataRecebida,
        '',
        '',
        undefined
      )
    ).subscribe({
      next: (res) => {
        this.faturamentoDiario = res.objeto;
      }, error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.valorFaturamentoDia = 0;
        this.faturamentoDiario.forEach((res) => {
          if (moment(this.dataRecebida).format('yyyy-MM-DD').toString() === moment(res.data).format('yyyy-MM-DD').toString()) {
            this.valorFaturamentoDia = res.valor;
          }
        });
        this.consultaParametrosMeta();
      }
    });
  }

  public consultaParametrosMeta() {
    this.parametrosService.consultarParamentrosMeta(moment(this.dataRecebida).format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        try {
          this.metaFaturamentoDoMes = res.valorMetaMensal;
          this.parametrosMeta = res;
        } catch (error) {

        }
      },
      error: (e) => { },
      complete: () => { this.consultaMetaDoDia() }
    });
  }

  public consultaMetaDoDia() {
    this.metaDiariaService.consultarMetaDoDia(this.dataRecebida).subscribe({
      next: (res) => {
        this.metaFaturamentoDoDia = 0;
        this.metaFaturamentoDoDia = res.valor
      },
      error: (e) => { },
      complete: () => {
        this.calculaGapDoDia();
      }
    });
  }

  public calculaGapDoDia() {
    this.arrowGap = "text-danger fa-angle-double-down";
    this.colorTextGapDia = 'text-danger'
    this.gapDoDia = (this.metaFaturamentoDoDia - this.valorFaturamentoDia);
    if (this.gapDoDia < 0) {
      this.gapDoDia *= -1;
      this.arrowGap = "text-success fa-angle-double-up";
      this.colorTextGapDia = 'text-success'
    }
    this.calcularPercentualDeFaturamentoDoDia();
  }

  private calcularPercentualDeFaturamentoDoDia() {
    if (this.metaFaturamentoDoDia != 0) {
      this.percentualFaturamento = ((this.valorFaturamentoDia / this.metaFaturamentoDoDia) * 100);
    } else {
      this.percentualFaturamento = 100;
    }
    this.calculaPercentualGrafico();
  }

  public calculaPercentualGrafico() {
    let i = 45;
    //Utilizado para classe Css de modificação da cor do gráfico
    let valorPercentual = (180 / this.metaFaturamentoDoDia);

    //Define o percetual do grafico
    i += (valorPercentual * this.valorFaturamentoDia);
    //Aplica cor ao gráfico conforme seu percentual
    if (i <= 134) {
      this.bgColor = 'bg-color-chart-30';
    }
    if (i >= 135) {
      this.bgColor = 'bg-color-chart-50';
    }
    if (i > 222) {
      this.bgColor = 'bg-color-chart-70';
    }
    if (i > 225) {
      i = 225;
    }
    this.rotateChart = `rotate:${i}deg; transition:4s`;
  }

  public visualizarDetalhesFaturamentoDoDia() {
    this.router.navigate([`faturamento-diario/${this.dataRecebida}`]);
  }
}

import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as bootstrap from 'bootstrap';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';
import { FaturamentoMensalService } from 'src/app/services/faturamento-mensal.service';

@Component({
  selector: 'app-card-mes',
  templateUrl: './card-mes.component.html',
  styleUrls: ['./card-mes.component.css']
})
export class CardMesComponent implements OnInit, OnDestroy, AfterViewInit {
  arrowGap: string;
  valorFaturamento: number = 0;
  valorFaturamendoAno: number = 0;
  gapDoMes: number = 0;
  metaFaturamentoDoMes: number = 0;
  modeloDeConsulta: ModeloConsulta;
  parametrosMeta: ParametrosMeta;
  dataRecebida: any = moment().format('yyyy-MM-DD');
  valorPercentualGrafico: any;
  bgColorGrafico: any = 'bg-color-chart-30';
  rotacaoGrafico: any;
  percentualFaturamento: any = 0;
  colorTextGapDia: any = 'text-danger';
  private nomeTela = "dashboard-sintetico";
  private toolTipElements: Element[] = [];
  private tooltips: bootstrap.Tooltip[] = [];

  constructor(
    private faturamentoService: FaturamentoMensalService,
    private dateService: DateControllerService,
    private parametrosService: ParametrosMetaService,
    private router: Router,
    private controleDeExibicaoService: ControleExibicaoService,
    private el: ElementRef
  ) {
    this.arrowGap = "text-danger fa-angle-double-down";
    this.modeloDeConsulta = new ModeloConsulta();
    this.parametrosMeta = new ParametrosMeta();
  }

  ngOnInit(): void {
    this.receberDataDeConsulta();
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
      s1: this.controleDeExibicaoService.verificaPermissaoDeAcesso('grafico_mensal', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultaValorFaturamento();
        this.consultaValorFaturamentoDoAno();
      }
    })
  }

  public consultaValorFaturamento() {
    this.faturamentoService.consultaTotalFaturamentoPorMes(this.dateService.getInicioDoMes(moment(this.dataRecebida).format('yyyy-MM-DD')), this.dataRecebida).subscribe({
      next: (res) => {
        try {
          this.valorFaturamento = res[0].valor;
        } catch (error) {
          this.valorFaturamento = 0;
        }
      },
      complete: () => {
        this.consultaParametrosMeta();
      }
    });
  }

  public consultaValorFaturamentoDoAno() {
    this.faturamentoService.consultaTotalFaturamentoPorMes(this.dateService.getInicioDoAno(moment(this.dataRecebida).format('yyyy-MM-DD')), this.dataRecebida).subscribe({
      next: (res) => {
        this.valorFaturamendoAno = 0;
        try {
          res.forEach(e => {
            this.valorFaturamendoAno += e.valor;
          })
        } catch (error) { }
      },
      complete: () => {
        this.consultaParametrosMeta();
      }
    });
  }

  public visualizarFaturamentoPeriodo() {
    this.router.navigate(['faturamento-periodo']);
  }

  public consultaParametrosMeta() {
    this.parametrosService.consultarParamentrosMeta(moment(this.dataRecebida).format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        try {
          this.metaFaturamentoDoMes = res.valorMetaMensal;
          this.parametrosMeta = res;
        } catch (error) { }
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        this.calculaGapDoMes();
      }
    });
  }

  public calculaGapDoMes() {
    this.gapDoMes = (this.metaFaturamentoDoMes - this.valorFaturamento);
    if (this.gapDoMes < 0) {
      this.gapDoMes *= -1;
      this.colorTextGapDia = 'text-success';
      this.arrowGap = "text-success fa-angle-double-up";
    } else {
      this.colorTextGapDia = 'text-danger';
      this.arrowGap = "text-danger fa-angle-double-down";
    }

    this.calcularPercentualDoGrafico();
    this.calculaPercentualFaturamento();
  }

  calcularPercentualDoGrafico() {
    let i = 45;
    let valorPercentual = (180 / this.parametrosMeta.valorMetaMensal);
    if (valorPercentual == 0) {
      i = 225;
      return;
    }
    i += (valorPercentual * this.valorFaturamento);
    if (i <= 134) {
      this.bgColorGrafico = 'bg-color-chart-30';
    }
    if (i >= 135) {
      this.bgColorGrafico = 'bg-color-chart-50';
    }
    if (i > 222) {
      this.bgColorGrafico = 'bg-color-chart-70';
    }
    if (i > 225) {
      i = 225;
    }
    this.rotacaoGrafico = `rotate:${i}deg; transition:4s`;
  }

  public calculaPercentualFaturamento() {
    if (this.parametrosMeta.valorMetaMensal != 0) {
      this.percentualFaturamento = ((this.valorFaturamento / this.metaFaturamentoDoMes) * 100);
    } else {
      this.percentualFaturamento = 0;
    }
  }

  receberDataDeConsulta() {
    FaturamentoService.emitirData.subscribe((data: any) => {
      this.dataRecebida = data;
      this.verificaPermissaoDeAcesso();
    });
  }

  public detalhesFaturamentoMensal() {
    this.router.navigate([`/faturamento-mensal/${this.dataRecebida}`]);
  }


}

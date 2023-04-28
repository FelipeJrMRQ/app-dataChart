import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { ParametrosMeta } from 'src/app/models/parametros-meta';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-card-mes',
  templateUrl: './card-mes.component.html',
  styleUrls: ['./card-mes.component.css']
})
export class CardMesComponent implements OnInit {
  arrowGap: string;
  valorFaturamento: number = 0;
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

  constructor(
    private faturamentoService: FaturamentoService,
    private dateService: DateControllerService,
    private parametrosService: ParametrosMetaService,
    private router: Router,
    private controleDeExibicaoService: ControleExibicaoService,
  ) {
    this.arrowGap = "text-danger fa-angle-double-down";
    this.modeloDeConsulta = new ModeloConsulta();
    this.parametrosMeta = new ParametrosMeta();
  }

  ngOnInit(): void {
    this.receberDataDeConsulta();
    this.verificaPermissaoDeAcesso();
  }

  private verificaPermissaoDeAcesso() {
    forkJoin({
      s1: this.controleDeExibicaoService.verificaPermissaoDeAcesso('grafico_mensal', this.nomeTela)
    }).subscribe(({ s1 }) => {
      if (s1) {
        this.consultaValorFaturamento();
      }
    })
  }

  public consultaValorFaturamento() {
    this.faturamentoService.consultaValorFaturamento(
      this.modeloDeConsulta.getInstance(
        this.dateService.getInicioDoMes(moment(this.dataRecebida).format('yyyy-MM-DD')),
        this.dataRecebida,
        '',
        '',
        undefined
      )).subscribe({
        next: (res) => {
          this.valorFaturamento = res.valorFaturamento;
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          this.consultaParametrosMeta();
        }
      });
  }

  public consultaParametrosMeta() {
    this.parametrosService.consultarParamentrosMeta(moment(this.dataRecebida).format('yyyy-MM-DD')).subscribe({
      next: (res) => {
        this.metaFaturamentoDoMes = res.valorMetaMensal;
        this.parametrosMeta = res;
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
    this.percentualFaturamento = ((this.valorFaturamento / this.metaFaturamentoDoMes) * 100);
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

import { observable, Observable } from 'rxjs';
import { FeriadoService } from './../../../services/feriado.service';
import { ClienteService } from './../../../services/cliente.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';

import * as moment from 'moment';

//Componentes
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { ParametrosMetaService } from 'src/app/services/parametros-meta.service';
import { ParametrosMeta } from 'src/app/models/parametros-meta'
import { AuthGuardService } from '../../../guards/auth-guard.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';
import { ModeloConsulta } from 'src/app/models/modelo-consulta';
import { FaturamentoDiario } from 'src/app/models/faturamento/faturamento-diario';
import { Usuario } from 'src/app/models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, OnDestroy {

  //Variaveis para data
  dataAtual: any = moment().format('yyyy-MM-DD');
  diasUteisTrabalhados: any = 0;
  diasTrabalhosComSabados: any = 0;
  diasParaFimDoMes: number = 0;
  sabadosParaFimDoMes: number = 0;
  feriadosDoMes: [] = [];

  //Objetos
  parametrosMeta: ParametrosMeta;
  modeloConsulta: ModeloConsulta;
  listaFaturamentoDiario: FaturamentoDiario[];
  usuario: Usuario;

  //Valores
  valorFaturamentoMes: number = 0;
  valorGapMes: number = 0;
  valorMediaEntrada: number = 0;
  valorFaturamento: number = 0;
  valorMediaFaturamentoDiasUteis: any = 0;
  valorMediaFaturamentoComSabados: any = 0;
  valorMediaCarteira: any = 0;
  intervalo: any;
  btn = false;

  constructor(
    private parametrosMetaService: ParametrosMetaService,
    private authService: AuthGuardService,
    private dateSevice: DateControllerService,
    private faturamentoService: FaturamentoService,
    private dateService: DateControllerService,
    private router: Router,
  ) {
    this.usuario = new Usuario();
    this.parametrosMeta = new ParametrosMeta();
    this.modeloConsulta = new ModeloConsulta();
    this.listaFaturamentoDiario = [];
  }

  ngOnInit(): void {
    // moment.locale("pt-br");
    // window.scrollTo(0, 0);
  }

  ngOnDestroy(): void {
    // clearInterval(this.intervalo);
  }

  public alterarParaModoSintetico() {
    this.router.navigate(['/dashboard-sintetico']);
  }
 
  public consultarPorData() {
    this.btn = true;
    this.emitirDataAtualizada();
    setTimeout(() => {
      this.btn = false;
    }, 3000);
  }

  private emitirDataAtualizada() {
    FaturamentoService.emitirData.emit(this.dataAtual);
  }
}
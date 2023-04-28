import { Component, OnInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { LogHora } from 'src/app/models/log-sistema/log-hora';
import { LogSistemaDTO } from 'src/app/models/log-sistema/log-sistema-dto';
import { LogView } from 'src/app/models/log-sistema/log-view';
import { LogSistemaService } from 'src/app/services/log-sistema.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-historico-atividades-sistema',
  templateUrl: './historico-atividades-sistema.component.html',
  styleUrls: ['./historico-atividades-sistema.component.css']
})
export class HistoricoAtividadesSistemaComponent implements OnInit {

  logs: LogSistemaDTO[];
  logView: LogView[];
  datas: string[] = [];
  dataInicial = moment().subtract(5, 'days').format('yyyy-MM-DD');
  dataFinal = moment().format('yyyy-MM-DD');
  @ViewChild('elemento', { static: false, read: ElementRef }) elemento: ElementRef | undefined;


  constructor(
    private controleExibicaoService: ControleExibicaoService,
    private logSistemaService: LogSistemaService,
    private usuarioService: UsuarioService,
    private elementRef: ElementRef,
    private render: Renderer2
  ) {
    this.logs = []
    this.logView = []
  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE HISTORICO DE ATIVIDADES DO USUARIO');
    this.consultarLogsDoUsuario();
  }
  public consultarLogsDoUsuario() {
    this.logs = [];
    this.logView = [];
    this.datas = [];
    this.logSistemaService.consultarLogsDoUsuario(this.dataInicial, this.dataFinal).subscribe({
      next: (res) => {
        this.logs = res;
        this.separaDatas();
      }
    });
  }

  /**
   * Transforma as datas repetidas em apenas uma data
   */
  private separaDatas() {
    this.logs.forEach(log => {
      if (!this.datas.some(d => moment(d).format('yyyy-MM-DD') === moment(log.data).format('yyyy-MM-DD'))) {
        this.datas.push(moment(log.data).format('yyyy-MM-DD'));
      }
    });
    this.prencherDatasNaView();
  }

  /**
   * Coloca as datas que foram devidamente separadas na 
   * variavel de visualização
   * 
   */
  private prencherDatasNaView() {
    this.datas.forEach(d => {
      let logV = new LogView();
      logV.data = d;
      this.logView.push(logV);
    });
    this.vincularHorariosNaView();
  }

  /**
   * Identifica cada horario de cada data e atribui os horarios a ela 
   */
  private vincularHorariosNaView() {
    this.logs.forEach(log => {
      if (this.logView.some(lv => lv.data == moment(log.data).format('yyyy-MM-DD'))) {
        let index = this.logView.findIndex(ll => ll.data == moment(log.data).format('yyyy-MM-DD'));
        let logHora = new LogHora();
        logHora.descricao = log.descricao;
        logHora.hora = moment(log.data).format('HH:mm:ss');
        this.logView[index].horarios.push(logHora);
      }
    });
    this.expandirHistoricoDaDataAtual();
  }

  /**
   * Manipulação de exibição da lista no html 
   * @param data 
   */
  public exibirHistoricoDeLogs(data: any) {
    let icon = this.elementRef.nativeElement.querySelector(`#icon_${data}`);
    let el = this.elementRef.nativeElement.querySelector(`#ul_${data}`);
    let classesAplicadas: [] = el.classList;
    classesAplicadas.forEach(classe => {
      if (classe == 'd-none') {
        this.render.removeClass(el, 'd-none');
        this.render.removeClass(icon, 'fa-plus-circle');
        this.render.addClass(icon, 'fa-minus-circle');
      } else {
        this.render.addClass(el, 'd-none');
        this.render.removeClass(icon, 'fa-minus-circle');
        this.render.addClass(icon, 'fa-plus-circle');
      }
    });
  }

  /**
   * Faz com que a exibição da primeira lista esteja sempre expandida
   */
  private expandirHistoricoDaDataAtual() {
    setTimeout(()=>{
      let el = this.elementRef.nativeElement.querySelector(`#ul_${moment().format('yyyy-MM-DD')}`);
      let icon = this.elementRef.nativeElement.querySelector(`#icon_${moment().format('yyyy-MM-DD')}`);
      this.render.removeClass(el, 'd-none');
      this.render.removeClass(icon, 'fa-plus-circle');
      this.render.addClass(icon, 'fa-minus-circle');
    }, 400);
  }
}

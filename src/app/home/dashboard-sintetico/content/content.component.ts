import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {

  dataEscolhida: any = moment().format('yyyy-MM-DD');
  private intervalo: any;
  public toolTip = [];



  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private renderer : Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) {

  }

  ngOnDestroy(): void {
    this.cancelarIntervalo();
  }

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    window.scroll(0,0);
    this.consultaPorIntervalo();
    this.registraLog();
  }

  private registraLog(){
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DASHBOARD SINTETICO');
  }

  public alterarParaModoAnalitico() {
    this.router.navigate(['/dashboard-analitico']);
  }

  public verificaPermissaoDoUsuario() {
    this.usuarioService.acessoNegado();
  }


  emitirData() {
    FaturamentoService.emitirData.emit(this.dataEscolhida);
  }

  private consultaPorIntervalo() {
    this.intervalo = setInterval(() => {
      this.emitirData();
    }, 60000);
  }

  private cancelarIntervalo() {
    clearInterval(this.intervalo);
  }

}

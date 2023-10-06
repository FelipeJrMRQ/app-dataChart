import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-carteira-form',
  templateUrl: './carteira-form.component.html',
  styleUrls: ['./carteira-form.component.css']
})
export class CarteiraFormComponent implements OnInit {

  tipoConsulta: any = "BENEFICIAMENTO";
  dataRecebida: any;
  nomeCliente: any;
  toolTip = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA DE CARTEIRA POR CLIENTE', "CARTEIRA CLIENTE");
    this.activeRoute.params.subscribe((param: any) => {
      this.dataRecebida = param.data;
      this.nomeCliente = param.nomeCliente;
    });

    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  public voltar() {
    window.history.back();
  }

}

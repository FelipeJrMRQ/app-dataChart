import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-faturamento-form',
  templateUrl: './faturamento-form.component.html',
  styleUrls: ['./faturamento-form.component.css']
})
export class FaturamentoFormComponent implements OnInit {

  dataRecebida: any;
  tipoConsulta: any = "CLIENTE";

  constructor(
    private activeRouter : ActivatedRoute,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA FATURAMENTO DIARIO');
    this.activeRouter.params.subscribe((param:any)=>{
      this.dataRecebida = param.data;
    });
  }

}

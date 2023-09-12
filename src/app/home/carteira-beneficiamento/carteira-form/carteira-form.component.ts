import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-carteira-form',
  templateUrl: './carteira-form.component.html',
  styleUrls: ['./carteira-form.component.css']
})
export class CarteiraFormComponent implements OnInit {


  tipoConsulta: any = 'CLIENTE';
  dataRecebida: any;
  nomeBeneficiamento: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA CARTEIRA POR BENEFICIAMENTO', "CARTEIRA -> BENEFICIAMENTO")
    this.activeRoute.params.subscribe((param:any)=>{
      this.dataRecebida = param.data;
      this.nomeBeneficiamento = param.nome;
    });
  }

}

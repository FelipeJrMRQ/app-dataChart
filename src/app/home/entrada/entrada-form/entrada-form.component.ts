import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntradaService } from 'src/app/services/entrada.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';

@Component({
  selector: 'app-entrada-form',
  templateUrl: './entrada-form.component.html',
  styleUrls: ['./entrada-form.component.css']
})
export class EntradaFormComponent implements OnInit {

  tipoConsulta: string ='CLIENTE'; 
  dataRecebida: any;

  constructor(
    private router : Router,
    private activeRoute: ActivatedRoute,
    private controleExibicaoService: ControleExibicaoService,
  ) { }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ENTRADA', 'ENTRADA');
    this.activeRoute.params.subscribe((param:any)=>{
      this.dataRecebida = param.data;
    })
  }

  public emitirDataSelecionada(){
    EntradaService.dataEntrada.emit(this.dataRecebida);
  }

}

import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioDTO } from 'src/app/models/usuario-dto';
import { LogSistemaService } from 'src/app/services/log-sistema.service';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit {

  acessos: number = 0;
  contasAtivas: number = 0;
  contasInativas: number = 0;
  totalUsuarios: number = 0;
  usuarios: UsuarioDTO[] = [];
  notificacoes: number = 0;
  notificados: number = 0;


  constructor(
    private logService: LogSistemaService,
    private usuarioService: UsuarioService,
    private controleExibicao: ControleExibicaoService,
    private dateService: DateControllerService,
  ) { }

  ngOnInit(): void {
    this.controleExibicao.registrarLog('ACESSOU A TELA DE ADMINISTRACAO', 'ADMINISTRACAO');
    this.consultarAcessos();
    this.consultarUsuarios();
  }

  public consultarAcessos(){
    this.logService.consultarAcessos(this.dateService.getInicioDoMes(moment().format('yyyy-MM-DD')), moment().format('yyyy-MM-DD')).subscribe({
      next:(res)=>{
        this.acessos = res;
      }
    });
  }

  public consultarUsuarios(){
    this.usuarioService.consultarTodos().subscribe({
      next:(res)=>{
        this.totalUsuarios = 0;
        this.totalUsuarios = res.length;
        this.usuarios = res;
      },
      complete:()=>{
        this.calculaContasAtivaInativas();
        this.calcularNotificacoes();
      }
    });
  }

  private calculaContasAtivaInativas(){
      this.usuarios.forEach(u=>{
        if(u.contaAtiva){
          this.contasAtivas+=1;
        }else{
          this.contasInativas+=1;
        }
      });
  }

  public calcularNotificacoes(){
    this.usuarios.forEach(u=>{
      if(u.notificacao){
        this.notificacoes +=1;
      }else{
        this.notificados+=1;
      }
    });
  }
}

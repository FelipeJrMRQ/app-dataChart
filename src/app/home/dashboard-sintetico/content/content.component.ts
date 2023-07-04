import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { FaturamentoService } from 'src/app/services/faturamento.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import * as bootstrap from 'bootstrap';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NotificacaoComponent } from 'src/app/shared/dialog/notificacao/notificacao.component';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioDTO } from 'src/app/models/usuario-dto';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit, OnDestroy {

  private usuario: UsuarioDTO;
  dataEscolhida: any = moment().format('yyyy-MM-DD');
  private intervalo: any;
  public toolTip = [];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private renderer : Renderer2,
    private controleExibicaoService: ControleExibicaoService,
    private dialog: MatDialog
  ) {
    this.usuario = new UsuarioDTO();
  }

  

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    window.scroll(0,0);
    this.consultaPorIntervalo();
    this.registraLog();
    this.consultaUsuario();
  }

  ngOnDestroy(): void {
    this.cancelarIntervalo();
  }

  private consultaUsuario(){
    this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
      next:(res)=>{
        this.usuario = res[0];
      },
      complete:()=>{
        if(this.usuario.notificacao){
          this.openDialog()
        }
      }
  });
  }

  /**
   * Verifica de há notificações para o usuário se houver será exibido a notificação na tela do usuário
   */
  private openDialog(){
    let dialog = this.dialog.open(NotificacaoComponent,{
      data: [],
      disableClose: true,
      height: '90%',
    });
    dialog.afterClosed().subscribe({
      next:(res)=>{
        let u = new Usuario;
        u.id = this.usuario.id;
        u.contaAtiva = this.usuario.contaAtiva;
        u.nome = this.usuario.nome;
        u.username = this.usuario.email
        u.notificacao = false;
        this.usuarioService.alterarUsuario(u).subscribe(res=>{
        });
      }
    })
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

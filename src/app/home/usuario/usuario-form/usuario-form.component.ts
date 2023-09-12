import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponenteTela } from 'src/app/models/tela/componente-tela';
import { TelaSistema } from 'src/app/models/tela/tela-sistema';
import { TelaUsuario } from 'src/app/models/tela/tela-usuario';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioDTO } from 'src/app/models/usuario-dto';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { TelaSistemaService } from 'src/app/services/telas/tela-sistema.service';
import { TelaUsuarioService } from 'src/app/services/telas/tela-usuario.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DlgLoadingComponent } from 'src/app/shared/dialog/dlg-loading/dlg-loading.component';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuario: Usuario;
  passwordCheck: any;
  telaPrincipal: boolean = false;
  outrasTelas: boolean = false;
  administrador: boolean = false;
  programacao: boolean = false;
  controleDeClique: boolean = true;
  email: string = "";
  usuarios: UsuarioDTO[] = [];
  modoDeEdicao: boolean = false;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  pagina: number = 1;
  itensPagina: number = 10;
  telasDoSistema: TelaSistema[];
  telasDoUsuario: TelaUsuario[];
  telaUsuario: TelaUsuario;
  componentesSelecionados: ComponenteTela[];
  editar = false;
  public toolTip = [];

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private telaService: TelaSistemaService,
    private telaUsuarioService: TelaUsuarioService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private controleExibicaoService: ControleExibicaoService,
    private dialog: MatDialog
  ) {
    this.usuario = new Usuario();
    this.telaUsuario = new TelaUsuario();
    this.telasDoSistema = [];
    this.telasDoUsuario = [];
    this.componentesSelecionados = [];
  }

  ngOnInit(): void {
    this.registraLog();
    this.consultarTelasDoSistema();
  }

  private registraLog() {
    this.controleExibicaoService.registrarLog('ACESSOU CADASTRO DE USUÁRIOS', 'USUARIOS');
  }

  private consultarTelasDoSistema() {
    this.telaService.consultarTelas().subscribe({
      next: (res) => {
        this.telasDoSistema = res;
      }
    });
  }

  public consultarTelasUsuario(usuario: Usuario) {
    this.telaUsuarioService.consultarTelas(usuario).subscribe({
      next: (res) => {
        this.telasDoUsuario = res;
      },
      error: (e) => {
        this.openSnackBar('Falha ao consultar usuário!', this.snackBarErro);
      },
      complete: () => {
        this.verificaTelasQueOUsuarioPossui();
      }
    });
  }

  private salvarTelasUsuario() {
    this.telasDoUsuario.forEach(tela => {
      tela.usuario = this.usuario;
      this.telaUsuarioService.salvarTela(tela).subscribe({
        next: (res) => {
        },
        error: (e) => {
          this.openSnackBar('Falha ao realizar operação!', this.snackBarErro);
        },
        complete: () => {
          this.dialog.closeAll();
          this.openSnackBar('Operação realizada com sucesso!', this.snackBarSucesso);
        }
      });
    });
    this.limparDados();
  }

  private verificaTelasQueOUsuarioPossui() {
    this.telasDoSistema.forEach(ts => {
      /**
       * Verifica as permissoes de acesso a tela do usuário
       */
      let tela = this.telasDoUsuario.find(tu => ts.rota == tu.rota);
      if (tela) {
        let el = this.elementRef.nativeElement.querySelector(`#${tela.rota}`);
        this.renderer.setProperty(el, 'checked', true);
      } else {
        let el = this.elementRef.nativeElement.querySelector(`#${ts.rota}`);
        this.renderer.setProperty(el, 'checked', false);
      }
      /**
       * Verifica a permissoes de acesso aos componentes da tela
       */
      ts.componentes.forEach(c => {
        let componente = tela?.componentes.find(cu => cu.nome == c.nome);
        if (componente) {
          let el = this.elementRef.nativeElement.querySelector(`#${ts.rota}_${c.nome}`);
          this.renderer.setProperty(el, 'checked', true);
        } else {
          let el = this.elementRef.nativeElement.querySelector(`#${ts.rota}_${c.nome}`);
          this.renderer.setProperty(el, 'checked', false);
        }
      });
    });
  }

  private visualizarTela(tela: TelaSistema) {
    let i = this.elementRef.nativeElement.querySelector(`#${tela.rota}`);
    this.renderer.setProperty(i, 'checked', true);
  }

  public IncluirTelaParaUsuario(event: any, tela: TelaSistema) {
    if (event.target.checked) {
      let telaTemp = new TelaUsuario();
      telaTemp.nome = tela.nome;
      telaTemp.rota = tela.rota;
      telaTemp.usuario = this.usuario;
      this.telasDoUsuario.push(telaTemp);
      this.controleExibicaoService.registrarLog(`HABILITOU A TELA [${tela.rota}] PARA [${this.usuario.username}]`, '');
    } else {
      this.telaUsuarioService.excluirTela(this.telasDoUsuario.find(t => t.rota == tela.rota)!).subscribe({
        next: (res) => {

        },
        complete: () => {
          this.telasDoUsuario.splice(this.telasDoUsuario.findIndex(t => t.rota == tela.rota), 1);
          tela.componentes.forEach(c => {
            let el = this.elementRef.nativeElement.querySelector(`#${tela.rota}_${c.nome}`);
            this.renderer.setProperty(el, 'checked', false);
          });
          this.controleExibicaoService.registrarLog(`DESABILITOU A TELA [${tela.rota}] PARA [${this.usuario.username}]`, '');
        }
      });
    }
  }

  public selecionarComponentes(event: any, componente: ComponenteTela, tela: TelaSistema) {
    if (event.target.checked == true) {
      this.visualizarTela(tela);
      let tu = this.telasDoUsuario.find(t => t.nome == tela.nome);
      if (tu) {
        tu?.componentes.push(componente);
      } else {
        let telaTemp = new TelaUsuario();
        telaTemp.nome = tela.nome;
        telaTemp.rota = tela.rota;
        telaTemp.usuario = this.usuario;
        telaTemp.componentes.push(componente);
        this.telasDoUsuario.push(telaTemp);
      }
      this.controleExibicaoService.registrarLog(`HABILITOU O COMPONENTE [${componente.nome}] NA TELA [${tela.rota}] PARA [${this.usuario.username}]`, '');
    } else {
      let index = this.telasDoUsuario.findIndex(t => t.nome == tela.nome);
      let cp = this.telasDoUsuario[index].componentes.findIndex(c => c.nome == componente.nome);
      this.telasDoUsuario[index].componentes.splice(cp, 1);
      this.controleExibicaoService.registrarLog(`DESABILITOU O COMPONENTE [${componente.nome}] NA TELA [${tela.rota}] PARA [${this.usuario.username}]`, '');
    }
  }

  public alterarUsuario() {
    this.usuarioService.alterarUsuario(this.usuario).subscribe({
      next: (res) => {
        this.openSnackBar("Cadastro de usuário alterado com sucesso!", this.snackBarSucesso);
      },
      error: (e) => {
        this.openSnackBar("Falha ao alterar cadastro de usuário!", this.snackBarErro);
      }, complete: () => {
        this.salvarTelasUsuario();
      }
    });
  }

  public cadastrarUsuario() {
    if (this.usuario.nome && this.usuario.username) {
      this.dialog.open(DlgLoadingComponent, { 
        disableClose: true,
        position: {
          top: '50px'
        }
      });
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: (res) => {
          this.usuario = res;
          this.openSnackBar("Usuário cadastrado com sucesso!", this.snackBarSucesso);
        },
        error: (e) => {
          this.openSnackBar("Falha ao enviar convite por e-mail!", this.snackBarErro);
          this.dialog.closeAll();
        },
        complete: () => {
          this.controleExibicaoService.registrarLog(`CADASTROU O USUÁRIO [${this.usuario.nome}]`, '');
          this.salvarTelasUsuario();
          this.dialog.closeAll();
        }
      });
    } else {
      this.openSnackBar('Digite o nome e e-mail do usuário', this.snackBarErro);
    }
  }

  public limparDados() {
    window.scroll(0, 0);
    this.usuarios = [];
    this.usuario = new Usuario;
    this.modoDeEdicao = false;
    this.email = "";
    this.passwordCheck = "";
    this.telaPrincipal = false;
    this.outrasTelas = false;
    this.administrador = false;
    this.editar = false;
    this.telasDoSistema = [];
    this.componentesSelecionados = [];
    this.telasDoUsuario = [];
    this.controleDeClique = true;
    this.consultarTelasDoSistema();
  }



  public editarUsuario(usuario: UsuarioDTO) {
    this.controleExibicaoService.registrarLog(`SELECIONOU O USUÁRIO [${usuario.email}]`, '');
    this.controleDeClique = false;
    this.editar = true;
    window.scroll(0, 0);
    this.modoDeEdicao = true;
    this.usuario = new Usuario();
    this.usuario.id = usuario.id;
    this.usuario.username = usuario.email;
    this.usuario.nome = usuario.nome;
    this.usuario.contaAtiva = usuario.contaAtiva;
    this.consultarTelasUsuario(this.usuario);
  }

  public consultarUsuario() {
    this.usuarioService.consultarUsuarioPorEmail(this.email).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.controleExibicaoService.registrarLog(`CONSULTOU O USUARIOS DO SISTEMA`, '');
      },
      error: (e) => {
        console.log(e);
      },
    });
  }


  public bloquearUsuario(usuario: any) {
    this.usuarioService.bloquearUsuario(usuario.id).subscribe({
      next: (res) => {
        this.openSnackBar("Alteração realizada com sucesso!", this.snackBarSucesso);
        this.consultarUsuario();
      },
      error: (e) => {
        this.openSnackBar("Falha ao bloquear usuário!", this.snackBarErro);
      },
      complete: () => {
        if (usuario.contaAtiva) {
          this.controleExibicaoService.registrarLog(`BLOQUEOU O ACESSO DO USUÁRIO [${usuario.email}]`,'');
        } else {
          this.controleExibicaoService.registrarLog(`DESBLOQUEOU O ACESSO DO USUÁRIO [${usuario.email}]`, '');
        }
      }
    });
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }

}

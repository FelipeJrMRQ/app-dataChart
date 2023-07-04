import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  email: string = "";
  usuarios: UsuarioDTO[] = [];
  modoDeEdicao: boolean = false;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  pagina: number = 1;
  itensPagina: number = 10;
  conta: boolean = false;
  panelOpenState = false;
  nomeComponente: any;
  telasDoSistema: TelaSistema[];
  telasDoUsuario: TelaUsuario[];
  telaUsuario: TelaUsuario;
  componentesSelecionados: ComponenteTela[];
  iconeRemocao: boolean = false;
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
    this.controleExibicaoService.registrarLog('ACESSOU CADASTRO DE USUÁRIOS')
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
        this.consultarTelasDoSistema();
      }
    });
  }

  public marcarItensDoUsuario(nomeTela: any) {
    //  let telaSelecionada: TelaSistema = new TelaSistema();  
    //  let telaUsuario: TelaSistema = new TelaSistema();  
    //  telaSelecionada =  this.telasDoSistema.find(t=>t.nome == nomeTela)!;
    //  if(this.telasDoUsuario.some(t=>t.nome === telaSelecionada.nome)){
    //     telaUsuario = this.telasDoUsuario.find(t=>t.nome === telaSelecionada.nome)!;
    //     console.log(telaSelecionada);
    //     telaSelecionada.componentes.forEach(c=>{
    //       if(telaUsuario.componentes.some(cu=>cu.nome === c.nome)){
    //         let imput: any = this.elementRef.nativeElement.querySelector(`#cp_${c.id}`);
    //         this.renderer.setProperty(imput, 'checked', true);
    //       }
    //     });
    //  }
  }

  private salvarTelasUsuario() {
    this.telasDoUsuario.forEach(tela => {
      this.telaUsuarioService.salvarTela(tela).subscribe({
        next: (res) => {
          this.openSnackBar('Operação realizada com sucesso!', this.snackBarSucesso);
        },
        error: (e) => {
          this.openSnackBar('Falha ao realizar operação!', this.snackBarErro);
        }
      });
    });
    this.controleExibicaoService.registrarLog('CADASTROU TELAS PARA USUÁRIO');
  }

  public exibirIconeDeRemocao(componente: ComponenteTela) {
    let i = this.elementRef.nativeElement.querySelector(`#icone_${componente.id}`);
    this.renderer.removeClass(i, 'fa-check');
    this.renderer.removeClass(i, 'text-success');
    this.renderer.addClass(i, 'fa-trash-alt');
    this.renderer.addClass(i, 'text-danger');
  }

  public exibirIconeVinculo(componente: ComponenteTela) {
    let i = this.elementRef.nativeElement.querySelector(`#icone_${componente.id}`);
    this.renderer.addClass(i, 'fa-check');
    this.renderer.addClass(i, 'text-success');
    this.renderer.removeClass(i, 'fa-trash-alt');
    this.renderer.removeClass(i, 'text-danger');
  }

  public removerTela(tela: TelaUsuario) {
    this.telaUsuarioService.excluirTela(tela).subscribe({
      next: (res) => {
        this.openSnackBar('Tela removida com sucesso!', this.snackBarSucesso);
        this.controleExibicaoService.registrarLog(`REMOVEU A TELA DO USUARIO: [${tela.usuario.username}] - TELA: [${tela.nome}]`);
      },
      error: (e) => {
        this.openSnackBar('Falha ao tentar remover tela!', this.snackBarErro);
      },
      complete: () => {
        this.consultarTelasUsuario(this.usuario);
      }
    });
  }

  public selecionarTodas(event: any, tela: TelaSistema) {
    this.componentesSelecionados = [];
    let tipo: boolean = event.target.checked;
    tela.componentes.forEach(c => {
      let imput: any = this.elementRef.nativeElement.querySelector(`#cp_${c.id}`);
      this.renderer.setProperty(imput, 'checked', tipo);
      if (tipo) {
        this.componentesSelecionados.push(c);
      } else {
        this.componentesSelecionados = [];
      }
    });
  }

  public vincularTelaAoUsuario(event: any, tela: TelaSistema) {
    let telaUsuario = new TelaUsuario();
    if (this.novaTela(tela.nome)) {
      telaUsuario.nome = tela.nome;
      telaUsuario.usuario = this.usuario;
      telaUsuario.rota = tela.rota;
      this.componentesSelecionados.forEach(t => {
        let ct = new ComponenteTela
        ct.nome = t.nome;
        telaUsuario.componentes.push(ct);
      });
      if (this.telasDoUsuario.find(t => t.nome == tela.nome)) {
        this.vincularComponentesATela(tela);
      } else {
        this.telasDoUsuario.push(telaUsuario);
      }
      this.componentesSelecionados = [];
      this.controleExibicaoService.registrarLog(`VINCULOU TELA AO USUARO [${tela.nome}]`);
    } else {
      this.vincularComponentesATela(tela);
    }
  }

  public vincularComponentesATela(tela: TelaSistema) {
    if (this.telasDoUsuario.find(t => t.nome === tela.nome)) {
      let index = this.telasDoUsuario.findIndex(t => t.nome == tela.nome);
      this.componentesSelecionados.forEach(c => {
        if (!this.telasDoUsuario[index].componentes.find(comp => comp.nome == c.nome)) {
          this.telasDoUsuario[index].componentes.push(c);
        }
      });
    }
  }

  public removerComponenteDaTelaDoUsuario(tela: TelaUsuario, componente: ComponenteTela) {
    if (this.telasDoUsuario.find(t => t.nome === tela.nome)) {
      this.usuarioService.removerComponenteTelaUsuario(componente.id).subscribe({
        next: (res) => {
          this.controleExibicaoService.registrarLog(`REMOVEU COMPONENTE DA TELA DO USUARIO: [${tela.usuario.username}] - TELA: [${tela.nome}] - COMPONENTE [${componente.nome}]`);
        },
        error: (e) => {
          console.log(e);
        }
      });
      let index = this.telasDoUsuario.findIndex(t => t.nome == tela.nome);
      this.telasDoUsuario[index].componentes.splice(this.telasDoUsuario[index].componentes.findIndex(c => c.nome == componente.nome), 1);
    }
  }

  public consultarTelasDoSistema() {
    this.telaService.consultarTelas().subscribe({
      next: (res) => {
        this.telasDoSistema = res;
      },
      complete: () => {
        this.verificaTelasQueOUsuarioPossui();
      }
    });
  }

  public verificaTelasQueOUsuarioPossui() {
    this.telasDoSistema.forEach(t => {

    });
  }

  public selecionarComponentes(event: any, componente: ComponenteTela) {
    if (event.target.checked === true && componente.nome == event.target.defaultValue) {
      if (this.componentesSelecionados.length != 0) {
        if (this.novoComponente(componente)) {
          this.componentesSelecionados.push(componente);
        }
      } else {
        this.componentesSelecionados.push(componente);
      }
    } else {
      this.removerComponenteDoArray(componente);
    }
  }

  public alterarUsuario() {
    this.usuarioService.alterarUsuario(this.usuario).subscribe({
      next: (res) => {
        this.limparDados();
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
      this.dialog.open(DlgLoadingComponent, { disableClose: true });
      this.usuarioService.cadastrarUsuario(this.usuario).subscribe({
        next: (res) => {
          this.openSnackBar("Usuário cadastrado com sucesso!", this.snackBarSucesso);
        },
        error: (e) => {
          this.openSnackBar("Falha ao enviar convite por e-mail!", this.snackBarErro);
          this.dialog.closeAll();
        },
        complete: () => {
          this.limparDados();
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
  }

  private novoComponente(componente: ComponenteTela) {
    return this.componentesSelecionados.some(c => c.id == componente.id);
  }

  private novaTela(nomeTela: any): boolean {
    let verificador = false;
    if (this.telasDoUsuario.length != 0) {
      this.telasDoUsuario.forEach(tela => {
        verificador = (tela.nome !== nomeTela);
      });
    } else {
      verificador = true;
    }
    return verificador;
  }

  public editarUsuario(usuario: UsuarioDTO) {
    this.controleExibicaoService.registrarLog(`SELECIONOU O USUÁRIO [${usuario.email}]`);
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

  private removerComponenteDoArray(componente: ComponenteTela) {
    this.componentesSelecionados.splice(this.componentesSelecionados.findIndex(cp => cp.id == componente.id), 1);
  }

  public consultarUsuario() {
    this.usuarioService.consultarUsuarioPorEmail(this.email).subscribe({
      next: (res) => {
        this.usuarios = res;
        this.controleExibicaoService.registrarLog(`CONSULTOU O USUARIOS DO SISTEMA`);
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

  public notificarUsuarios() {
    this.usuarioService.consultarTodos().subscribe({
      next: (res) => {
        this.prepararParaNotificacao(res);
      }
    });
  }

  private prepararParaNotificacao(dto: UsuarioDTO[]) {
    dto.forEach(e => {
      let u = new Usuario();
      u.contaAtiva = e.contaAtiva
      u.id = e.id;
      u.nome = e.nome;
      u.notificacao = true;
      u.username = e.email;
      this.usuarioService.alterarUsuario(u).subscribe({
         next:(res)=>{} 
      });
    });
    this.openSnackBar('Notificações atualizadas com sucesso!', this.snackBarSucesso);
  }



  public bloquearUsuario(id: any) {
    this.usuarioService.bloquearUsuario(id).subscribe({
      next: (res) => {
        this.openSnackBar("Alteração realizada com sucesso!", this.snackBarSucesso);
        this.consultarUsuario();
      },
      error: (e) => {
        this.openSnackBar("Falha ao bloquear usuário!", this.snackBarErro);
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

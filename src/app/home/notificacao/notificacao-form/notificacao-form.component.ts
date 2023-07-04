import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Notificacao } from 'src/app/models/notificacao';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioDTO } from 'src/app/models/usuario-dto';
import { NotificacaoService } from 'src/app/services/notificacao.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NotificacaoComponent } from 'src/app/shared/dialog/notificacao/notificacao.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notificacao-form',
  templateUrl: './notificacao-form.component.html',
  styleUrls: ['./notificacao-form.component.css']
})
export class NotificacaoFormComponent implements OnInit {

  notificacao: Notificacao;
  versaoApp: any = environment.versaoApp;
  usuarios: UsuarioDTO[] =[];
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';


  constructor(
    private notificacaoService: NotificacaoService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private matDialog: MatDialog
  ) {
    this.notificacao = new Notificacao();
  }

  ngOnInit(): void {
    this.consultarUsuarios();
    this.consultarNotificacao();
  }

  public consultarUsuarios(){
    this.usuarioService.consultarTodos().subscribe({
      next:(res)=>{
        this.usuarios = res;
      }
    });
  }

  public visualizar(){
    this.matDialog.open(NotificacaoComponent, {});
  }

  public notificarUsuario(usuario: UsuarioDTO) {
    let u = new Usuario();
      u.contaAtiva = usuario.contaAtiva
      u.id = usuario.id;
      u.nome = usuario.nome;
      u.notificacao = true;
      u.username = usuario.email;
      this.usuarioService.alterarUsuario(u).subscribe({
         next:(res)=>{},
         complete:()=>{
            this.openSnackBar('O usuário será notificado em breve!', this.snackBarSucesso);
            this.consultarUsuarios();
         } 
      });
  }

  public cancelarNotificacao(usuario: UsuarioDTO){
    let u = new Usuario();
    u.contaAtiva = usuario.contaAtiva
    u.id = usuario.id;
    u.nome = usuario.nome;
    u.notificacao = false;
    u.username = usuario.email;
    this.usuarioService.alterarUsuario(u).subscribe({
       next:(res)=>{},
       complete:()=>{
          this.openSnackBar('Processo de notificação cancelado!', this.snackBarSucesso);
          this.consultarUsuarios();
       } 
    });
  }

  public notificarTodos() {
    this.usuarios.forEach(e => {
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
    setTimeout(()=>{
      this.consultarUsuarios();
    },1000)
    this.openSnackBar('Notificações atualizadas com sucesso!', this.snackBarSucesso);
  }

  public cancelarTodos() {
    this.usuarios.forEach(e => {
      let u = new Usuario();
      u.contaAtiva = e.contaAtiva
      u.id = e.id;
      u.nome = e.nome;
      u.notificacao = false;
      u.username = e.email;
      this.usuarioService.alterarUsuario(u).subscribe({
         next:(res)=>{} 
      });
    });
    setTimeout(()=>{
      this.consultarUsuarios();
    },1000)
    this.openSnackBar('Notificações atualizadas com sucesso!', this.snackBarSucesso);
  }

  public consultarNotificacao(){
    this.notificacaoService.consultarNotificacao(1).subscribe({
      next:(res)=>{
        this.notificacao = res;
      }
    });
  }

  public salvarNotificacao() {
    this.notificacao.mensagem
    this.notificacaoService.salvarNotificacao(this.notificacao).subscribe({
      next: (res) => {
        this.openSnackBar('Notificação atualizada com sucesso!', this.snackBarSucesso);
      },
      complete: () => {

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

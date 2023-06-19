import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from './../../../models/user';
import { LoginService } from 'src/app/services/login.service';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';


@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  user: User;
  private response: HttpErrorResponse | undefined;
  snackBarError = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';
  usuario: Usuario;
  jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
    private usuarioService: UsuarioService,
    private controleExibicaoService: ControleExibicaoService,
  ) {
    this.user = new User();
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
      
  }

  public fazerLogin() {
    let token = "";
    this.loginService.realizarLogin(this.user.email, this.user.senha).subscribe({
      next: (res) => {},
      error: (e) => {
        this.response = e;
        if (this.response?.status == 403 || this.response?.status == 500 || this.response?.status == 401) {
          this.openSnackBar("Usuário ou senha inválidos", this.snackBarError)
        } else {
          token = this.response?.error.text;
          this.gravarTokenNaSession(token);
          this.controleExibicaoService.registrarLog('USUARIO AUTENTICADO');
        }
      }
    });
  }

  private gravarTokenNaSession(token: any){
    sessionStorage.setItem('dataChart', token);
    this.gravarEmailNaSession(token);
  }

  private gravarEmailNaSession(token: any){
    sessionStorage.setItem("user", this.jwtHelper.decodeToken(token).sub);
    this.consultarUsuarioAutenticadoPorEmail();
  }

  private consultarUsuarioAutenticadoPorEmail(){
    this.usuarioService.consultarUsuarioPorEmail(sessionStorage.getItem('user')).subscribe({
      next:(res)=>{
        this.usuario = res[0];
      },
      complete:()=>{
        UsuarioService.usuarioAutenticado.emit(this.usuario);
        this.verificaHomePageDoUsuario();
      }
    });
  }

  private verificaHomePageDoUsuario(){
    if(this.usuario.homePage){
      this.router.navigate([`/${this.usuario.homePage}`]);
    }else{
      this.router.navigate(['/dashboard-sintetico']);
    }
  }

  openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, "X", {
      duration: 6000,
      panelClass: [tipo],
      horizontalPosition: "center",
      verticalPosition: "top",
    });
  }


}

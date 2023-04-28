
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  usuario:User;
  usuarioLogado:boolean = false;

  constructor(
    private router:Router,
    private snackBar:MatSnackBar,
  ) {
    this.usuario = new User();
  }

  public verificar(user: User){
    if(user.email =="felipe" && user.senha == "102030"){
      this.usuarioLogado = true;
      this.router.navigate([`/atualizador`]);
      this.usuario.email="";
      this.usuario.senha="";
      this.openSnackBar("Login realizado com sucesso!",this.snackBarSucesso);
    }else{
      this.openSnackBar("Email ou senha não cadastrado!",this.snackBarErro);
      this.usuarioLogado = false;
    }
   }

   public estaLogado(){
    return this.usuarioLogado;
   }

   openSnackBar(mensagem: string, tipo: string) {
    this.snackBar.open(mensagem, 'X', {
      panelClass: [tipo],
      duration: 6000,
      horizontalPosition: "right",
      verticalPosition: "top",
    });
  }
}

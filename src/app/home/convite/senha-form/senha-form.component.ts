import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-senha-form',
  templateUrl: './senha-form.component.html',
  styleUrls: ['./senha-form.component.css']
})
export class SenhaFormComponent implements OnInit {

  mensagemDeEnvio = false;
  email:string = "";
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private usuarioService:UsuarioService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {

  }

  public consultarEenviarEmail(){
    
    let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(regex.test(this.email)){
      this.mensagemDeEnvio = true;
      this.usuarioService.consultarUsuarioPorEmailRecuperarSenha(this.email).subscribe(({
        next:(res)=>{
        },error:(error)=>{
        },complete:()=>{
        }
      }));
      this.email = '';
      this.mensagemDeEnvio = true;
      this.limparConfirmcao();
    }else{
      this.openSnackBar("Digite um e-mail válido!",this.snackBarErro)
    }
  }

  limparConfirmcao(){
    setTimeout(()=>{
        this.mensagemDeEnvio = false;
    },10000)
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

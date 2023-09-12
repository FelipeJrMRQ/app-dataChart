import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dlg-update-senha',
  templateUrl: './dlg-update-senha.component.html',
  styleUrls: ['./dlg-update-senha.component.css']
})
export class DlgUpdateSenhaComponent implements OnInit {

  public senha: string = '';
  public nSenha: string = '';
  public cSenha: string = '';
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DlgUpdateSenhaComponent>,
    private controleExibicaoService: ControleExibicaoService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.controleExibicaoService.registrarLog('ACESSOU A TELA ALTERACAO DE SENHA', 'ALTERACAO SENHA');
  }

  public alterarSenha() {
    if (this.validarSenha()) {
      this.usuarioService.alterarSenha(sessionStorage.getItem('user'), this.senha, this.nSenha).subscribe({
        next: (res) => {
          this.openSnackBar('Senha alterada com sucesso!', this.snackBarSucesso);
          this.controleExibicaoService.registrarLog('ALTEROU A SENHA', '');
          this.fecharDialogo();
        },
         error:(e)=> {
          this.openSnackBar("A senha atual não corresponde com a senha cadastrada!", this.snackBarErro);
        }
      });
    }
  }

  private validarSenha(): boolean {
    if (this.senha === '') {
      this.openSnackBar('Preencha o campo com a senha atual!', this.snackBarErro);
      return false;
    } else if (this.nSenha === '') {
      this.openSnackBar('Preencha o campo nova senha!', this.snackBarErro);
      return false;
    } else if (this.nSenha.length < 6) {
      this.openSnackBar('A senha deve ter mais de 5 digitos!', this.snackBarErro);
      return false
    }else if(this.cSenha !== this.nSenha){
      this.openSnackBar('As senhas não são iguais!!', this.snackBarErro);
      return false;
    }
    return true;
  }

  public fecharDialogo() {
    this.dialogRef.close();
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

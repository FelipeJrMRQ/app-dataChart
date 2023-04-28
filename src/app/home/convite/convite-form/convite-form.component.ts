import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Route, Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { DlgUpdatePasswordComponent } from '../dlg-update-password/dlg-update-password.component';

@Component({
  selector: 'app-convite-form',
  templateUrl: './convite-form.component.html',
  styleUrls: ['./convite-form.component.css']
})
export class ConviteFormComponent implements OnInit {

  codigo: any; 
  usuario: Usuario; 
  dialogRef: any;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { 
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    
  }

  public validarCodigoConvite(){
    this.usuarioService.validarConviteUsuario(this.codigo).subscribe({
      next:(res)=>{
          if(res !== null){
            this.usuario = res;
            this.openDialog();
          } else{
            this.openSnackBar("Código de convite inexistente!", this.snackBarErro);
          }
      },
      error:(e)=>{
        console.log('Erro');
      }
    });
  }

  public openDialog(){
    this.dialogRef = this.dialog.open(DlgUpdatePasswordComponent, {
        data: this.usuario,
        disableClose: true
    });
  }

  public cadastrar(){
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

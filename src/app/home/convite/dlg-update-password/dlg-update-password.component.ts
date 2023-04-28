import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dlg-update-password',
  templateUrl: './dlg-update-password.component.html',
  styleUrls: ['./dlg-update-password.component.css']
})
export class DlgUpdatePasswordComponent implements OnInit {

  usuario: Usuario;
  password: any;
  passwordConfirm: any;
  btn: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Usuario,
    private dialogRef: MatDialogRef<DlgUpdatePasswordComponent>,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    this.usuario = this.data;
  } 

  public validarPassword(){
    if(this.password == this.passwordConfirm && this.password){
      this.btn= false;
    }else{
      this.btn =  true;
    }
  }

  public cadastrar(){
    this.usuario.password = this.password;
    this.usuarioService.alterarUsuario(this.usuario).subscribe({
      next:(res)=>{
        this.dialogRef.close();
        this.router.navigate(['/']);
      }
    });
  }





}

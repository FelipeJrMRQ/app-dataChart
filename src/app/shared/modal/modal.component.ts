import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  
 
  user:User;
  private response: HttpErrorResponse | undefined;
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    public dialogRef:MatDialogRef<ModalComponent>,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.user = new User();
   }

  ngOnInit(): void {

  }

  cancel():void{
    this.dialogRef.close();
  }

  public verificar(){
    this.loginService.realizarLogin(this.user.email, this.user.senha).subscribe({
      next:(res)=>{
        console.log(res);
      },
      error:(e)=>{
        this.response = e;
        if(this.response?.status == 403 || this.response?.status == 500 || this.response?.status == 401.){
          this.openSnackBar("Usuário ou senha inválidos", this.snackBarErro);
        }else{
          sessionStorage.setItem('dataChart', this.response?.error.text);
          this.dialogRef.close();
          this.router.navigate(['/']);
        }
      }
    });
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

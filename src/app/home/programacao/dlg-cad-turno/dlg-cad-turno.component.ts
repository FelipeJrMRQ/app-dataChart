import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Turno } from 'src/app/models/turno';
import { TurnoService } from 'src/app/services/turno.service';

@Component({
  selector: 'app-dlg-cad-turno',
  templateUrl: './dlg-cad-turno.component.html',
  styleUrls: ['./dlg-cad-turno.component.css']
})
export class DlgCadTurnoComponent implements OnInit {

  turno: Turno;
  turnos: Turno[];
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private snackBar: MatSnackBar,
    private turnoService: TurnoService,
    private dialogRef: MatDialogRef<DlgCadTurnoComponent>,
  ) { 
    this.turno = new Turno();
    this.turnos = [];
  }

  ngOnInit(): void {
    
  }

  public fechar(){
    this.dialogRef.close();
  }

  public salvar(){
    this.turnoService.salvar(this.turno).subscribe({
      next:(res)=>{
        this.openSnackBar("Turno de trabalho salvo com sucesso!", this.snackBarSucesso);
        TurnoService.turnoCadastrado.emit();
        this.dialogRef.close();
      },
      error:(e)=>{
        this.openSnackBar("Falha ao salvar turno de trabalho", this.snackBarSucesso);
        this.dialogRef.close();
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

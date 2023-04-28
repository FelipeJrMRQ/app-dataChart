import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';

@Component({
  selector: 'app-dlg-cad-linha',
  templateUrl: './dlg-cad-linha.component.html',
  styleUrls: ['./dlg-cad-linha.component.css']
})
export class DlgCadLinhaComponent implements OnInit {

  linhaDeProducao: LinhaDeProducao;
  linhas: LinhaDeProducao[];
  snackBarErro = 'my-snack-bar-erro';
  snackBarSucesso = 'my-snack-bar-sucesso';

  constructor(
    private linhaService: LinhaDeProducaoService,
    private dialogRef: MatDialogRef<DlgCadLinhaComponent>,
    private snackBar: MatSnackBar,
  ) { 
    this.linhaDeProducao = new LinhaDeProducao();
    this.linhas = [];
  }

  ngOnInit(): void {
  }

  public fechar(){
    this.dialogRef.close();
  }

  public salvar(){
    this.linhaService.salvar(this.linhaDeProducao).subscribe({
      next:(res)=>{
          this.openSnackBar("Linha de produção cadastrada com sucesso!", this.snackBarSucesso);
          LinhaDeProducaoService.linhaCadastrada.emit();
          this.dialogRef.close();
      },error:(e)=>{
        this.openSnackBar("Falha ao cadastrar linha de produção!", this.snackBarErro);
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

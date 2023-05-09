import { Component, OnInit, Renderer2 } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LinhaDeProducao } from 'src/app/models/linha-de-producao';
import { LinhaDeProducaoService } from 'src/app/services/linha-de-producao.service';
import * as bootstrap from 'bootstrap';
import * as moment from 'moment';

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
  public toolTip = [];

  constructor(
    private linhaService: LinhaDeProducaoService,
    private dialogRef: MatDialogRef<DlgCadLinhaComponent>,
    private snackBar: MatSnackBar,
    private renderer : Renderer2,
    private linhaDeProducaoService: LinhaDeProducaoService,
  ) { 
    this.linhaDeProducao = new LinhaDeProducao();
    this.linhas = [];
  }

  ngOnInit(): void {
    this.renderer.selectRootElement(this.toolTip = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]')));
    var tootipList = this.toolTip.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    this.consultarLinhasDeProducao();
  }

  public fechar(){
    this.dialogRef.close();
  }

  public consultarLinhasDeProducao(){
    this.linhaDeProducaoService.consultar().subscribe({
      next:(res)=>{
        this.linhas = res;
      }
    })
  }

  public alterarStatus(linha: LinhaDeProducao){
      if(linha.status == "ATIVO"){
        linha.status = "INATIVO"
      }else if(linha.status == "INATIVO"){
        linha.status = "ATIVO";
      }
      this.linhaDeProducaoService.salvar(linha).subscribe({
        next:(res)=>{
          this.consultarLinhasDeProducao();
        }
      });
  }

  public salvar(){
    if(this.linhaDeProducao.nome == undefined || this.linhaDeProducao.nome.trim() == ""){
      this.openSnackBar("Defina um noma para a linha de produção", this.snackBarErro);
      return;
    }
    this.linhaDeProducao.status = "ATIVO";
    this.linhaDeProducao.dataInclusao = new Date();
    this.linhaService.salvar(this.linhaDeProducao).subscribe({
      next:(res)=>{
          this.openSnackBar("Linha de produção cadastrada com sucesso!", this.snackBarSucesso);
          this.consultarLinhasDeProducao();
          LinhaDeProducaoService.linhaCadastrada.emit();
      },error:(e)=>{
        this.openSnackBar("Falha ao cadastrar linha de produção!", this.snackBarErro);
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

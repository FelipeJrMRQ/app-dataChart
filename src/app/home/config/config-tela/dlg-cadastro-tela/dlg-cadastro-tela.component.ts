import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TelaSistema } from 'src/app/models/tela/tela-sistema';
import { TelaSistemaService } from 'src/app/services/telas/tela-sistema.service';

@Component({
  selector: 'app-dlg-cadastro-tela',
  templateUrl: './dlg-cadastro-tela.component.html',
  styleUrls: ['./dlg-cadastro-tela.component.css']
})
export class DlgCadastroTelaComponent implements OnInit {

  public telaSistema: TelaSistema;

  constructor(
    private telaSistemaService: TelaSistemaService,
    private dialogRef: MatDialogRef<DlgCadastroTelaComponent>,
  ) { 
    this.telaSistema = new TelaSistema();
  }

  ngOnInit(): void {

  }

  public salvarTelaSistema(){
    this.telaSistema.componentes = [];
      this.telaSistemaService.salvar(this.telaSistema).subscribe({
        next:(res)=>{
          this.fecharDialogo();
        }
      });
  }

  public fecharDialogo(){
    this.dialogRef.close();
  }
}

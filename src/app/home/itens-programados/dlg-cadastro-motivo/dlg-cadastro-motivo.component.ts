import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Motivo } from 'src/app/models/motivo';
import { MotivoService } from 'src/app/services/motivo.service';

@Component({
  selector: 'app-dlg-cadastro-motivo',
  templateUrl: './dlg-cadastro-motivo.component.html',
  styleUrls: ['./dlg-cadastro-motivo.component.css']
})
export class DlgCadastroMotivoComponent implements OnInit {

  motivo:Motivo
  motivoDescricao:any;
  tipoMotivo:any;

  constructor(
    private motivoService:MotivoService,
    private dialogRef:MatDialogRef<DlgCadastroMotivoComponent>
  ) {
    this.motivo = new Motivo();
   }

  ngOnInit(): void {

  }
  
  public salvarMotivo(){
    this.motivo.motivoDescricao = this.motivoDescricao.toUpperCase();
    this.motivo.tipoMotivo = this.tipoMotivo.toUpperCase();
    this.motivoService.criarMotivo(this.motivo).subscribe(({
      next:(res)=>{
        console.log(res)
      },complete:()=>{
        this.motivoDescricao ="";
        this.tipoMotivo = "";
        this.fechar();
      }
    }))
  }

  public fechar(){
    this.dialogRef.close();
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dgl-confirmacao',
  templateUrl: './dgl-confirmacao.component.html',
  styleUrls: ['./dgl-confirmacao.component.css']
})
export class DglConfirmacaoComponent implements OnInit {

  constructor(
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<DglConfirmacaoComponent>,
  ) { }

  ngOnInit(): void {
  }

  public iniciarProgramacao(){
    this.dialog.close(
      {data: true}
    )
  }

  public fechar(){
    this.dialog.close({
      data: false
    })
  }

}

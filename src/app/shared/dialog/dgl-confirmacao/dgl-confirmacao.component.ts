import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dgl-confirmacao',
  templateUrl: './dgl-confirmacao.component.html',
  styleUrls: ['./dgl-confirmacao.component.css']
})
export class DglConfirmacaoComponent implements OnInit {

  mensagem: any = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<DglConfirmacaoComponent>,
  ) { }

  ngOnInit(): void {
    this.mensagem = this.data.mensagem;
  }

  public sim(){
    this.dialog.close({data: true});
  }

  public nao(){
    this.dialog.close({data: false});
  }

}

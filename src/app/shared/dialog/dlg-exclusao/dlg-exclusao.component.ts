import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dlg-exclusao',
  templateUrl: './dlg-exclusao.component.html',
  styleUrls: ['./dlg-exclusao.component.css']
})
export class DlgExclusaoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DlgExclusaoComponent>
  ) { }

  ngOnInit(): void {
  }


  public sim() {
    this.dialogRef.close({
      data: true
    });
  }

  public nao() {
    this.dialogRef.close({
      data: false
    });
  }

}

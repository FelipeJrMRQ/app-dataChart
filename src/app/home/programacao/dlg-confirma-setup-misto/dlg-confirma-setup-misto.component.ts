import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dlg-confirma-setup-misto',
  templateUrl: './dlg-confirma-setup-misto.component.html',
  styleUrls: ['./dlg-confirma-setup-misto.component.css']
})
export class DlgConfirmaSetupMistoComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<DlgConfirmaSetupMistoComponent>,
  ) { }

  ngOnInit(): void {
  }

  public fecharDialogo(){
    this.dialogRef.close({
      data: false
    });
  }

  public habilitarSetupMisto(){
    this.dialogRef.close({
      data: true
    });
  }
}

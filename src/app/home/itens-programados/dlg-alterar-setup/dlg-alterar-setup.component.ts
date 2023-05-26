import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dlg-alterar-setup',
  templateUrl: './dlg-alterar-setup.component.html',
  styleUrls: ['./dlg-alterar-setup.component.css']
})
export class DlgAlterarSetupComponent implements OnInit {

  sequeciaSetup: number  = 1;
  constructor(
    private dialogRef: MatDialogRef<DlgAlterarSetupComponent>
  ) { }

  ngOnInit(): void {

  }

  public alterarSetup(){
    this.dialogRef.close({
      data: this.sequeciaSetup
    })
  }

  public cancelarOperacao(){
    this.dialogRef.close();
  }

}

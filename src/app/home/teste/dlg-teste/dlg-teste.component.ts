import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dlg-teste',
  templateUrl: './dlg-teste.component.html',
  styleUrls: ['./dlg-teste.component.css']
})
export class DlgTesteComponent implements OnInit {

  version:any;
  sequencia: any;

  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<DlgTesteComponent>
  ) {
    this.version = environment.versaoApp;
   }

  ngOnInit(): void {

  }


  fechar():void{
    this.dialogRef.close({
        data: {'sequencia': this.sequencia, 'item': this.data}
    });
  }
}

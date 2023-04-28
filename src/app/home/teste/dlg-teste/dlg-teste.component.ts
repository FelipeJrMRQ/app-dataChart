import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-dlg-teste',
  templateUrl: './dlg-teste.component.html',
  styleUrls: ['./dlg-teste.component.css']
})
export class DlgTesteComponent implements OnInit {

  version:any;

  

  constructor(
    private dialogRef:MatDialog
  ) {
    this.version = environment.versaoApp;
   }

  ngOnInit(): void {

  }


  fechar():void{
    this.dialogRef.closeAll();
  }
}

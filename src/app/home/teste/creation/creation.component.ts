import { Component, OnInit } from '@angular/core';
import { BarController, BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import { Teste } from '../teste';
import { MatDialog } from '@angular/material/dialog';
import { DlgTesteComponent } from '../dlg-teste/dlg-teste.component';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {

  testes: Teste[] = [];
  elemento: any;
  sequencia: any;


  constructor(
    private dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    for (let i = 1; i <= 10; i++) {
      let teste = new Teste();
      teste.nome = `P${i}`;
      teste.sequencia = i;
      this.testes.push(teste);
    }
  }

  public abrirDialogo(item: Teste) {
    let dialogo = this.dialog.open(DlgTesteComponent, {
      data: item
    });
    dialogo.afterClosed().subscribe(res => {
      if (res.data.sequencia) {
        this.alteracao(res.data.item, res.data.sequencia);
      }
    });
  }

  public alteracao(item: Teste, sequencia: any) {
    this.testes;
    // Localiza o indece de destino do array
    let indexDestino = this.testes.findIndex(t => t.sequencia == sequencia);
    let indexOrigem = this.testes.findIndex(t=>t.sequencia == item.sequencia);
    let arrayTemp;
   
    if(indexDestino > indexOrigem){
      arrayTemp = this.testes.splice(indexDestino);
      let i = this.testes[indexOrigem];
      this.testes.splice(indexOrigem, 1);
      this.testes.push(i);
  
    }else{
      let item = this.testes[indexOrigem];
      this.testes.splice(indexOrigem, 1)
      arrayTemp = this.testes.splice(indexDestino);
      this.testes.push(item);
    }
    
    arrayTemp.forEach((e: Teste) => {
      this.testes.push(e);
    });

    //Redefine a sequencia dos testes 
    let ti = 1;
    this.testes.forEach(t => {
      t.sequencia = ti;
      ti++;
    });

    //Insere o valor desejado na posição de destino
    //this.testes[indexDestino] = item;

    //Recoloca o item armazenados no fim da lista 
   
  }







}

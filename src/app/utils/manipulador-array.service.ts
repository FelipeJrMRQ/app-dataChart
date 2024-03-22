import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ManipuladorArrayService {

  constructor() { }


  /**
   * Troca a posição de um elemento dentro de um array recolocando todos os itens abaixo da posição
   * selecionada na mesma ordem antes da alteração
   * 
   * Exemplo do array antes de depois das alteração aplicadas
   * 
   * A[1,2,3,4,5,6] D[1,6,2,3,4,5]
   * 
   * 
   * @param origem 
   * @param destino 
   * @param array 
   */
  public alterarPosicaoDoElementoNoArray(origem: number, destino: number, array: any[]): any[] {
    let arrayTemp = [];
    let item = array[origem];

    if(destino > origem){
      arrayTemp = array.splice(++destino);
      array.splice(origem, 1);
      array.push(item);
    }else if( destino < origem){
      array.splice(origem, 1)
      arrayTemp = array.splice(destino);
      array.push(item);
    }

    arrayTemp.forEach(t=>{
      array.push(t);
    });

    return array;
  }

  /**
   * Se sua lista de dados possuir o atribudo data ela poderá ser ordenada por este atributo
   * @param lista 
   * @returns 
   */
  public ordernarArrayPorData(lista: any) {
    return lista.sort((a: any, b: any) => b.data.localeCompare(a.data));
  }

}

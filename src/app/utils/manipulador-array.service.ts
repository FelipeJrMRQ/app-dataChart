import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManipuladorArrayService {

  constructor() { }


  /**
   * Troca a posição de um elemento dentro de um array recolocando todos os itens abaixo da possição
   * seleciona na mesma ordem antes da alteração
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

    /**!this.faturamentoDiario.some(faturamento => faturamento.data === entrada.data);
   * Dentro da função de filtro, estamos usando some no array this.faturamentoDiario.
   * O método some verifica se pelo menos um elemento no array satisfaz a condição especificada.
   * Estamos verificando se não há nenhum faturamento cuja data corresponda à data da entrada atual.
   * Se nenhum faturamento tiver a mesma data da entrada, isso significa que é uma data diferente e,portanto, retornamos true, caso contrário,retornamos false.
  **/
  public verificarDifenreçaDeAtributoDataEntreLista(lista: any, lista2: any) {
    let diferença = lista.filter((entrada: any) => !lista2.some((valor: any) => valor.data === entrada.data));
    diferença.forEach((v: any) => {
      lista2.push({
        id: v.id,
        data: v.data,
        valor: 0,
      });
    });
    return lista2;
  }

  public calcularValoresGraficos(lista: any, listaData?: any[]) {
    let listaValores: any[] = [];
    lista.forEach((e: any) => {
      listaValores.push(e.valor);
      listaData?.push(moment(e.data).date());
    });
    return listaValores;
  }

  public ordernarArrayPorData(lista: any) {
    return lista.sort((a: any, b: any) => b.data.localeCompare(a.data));
  }

}

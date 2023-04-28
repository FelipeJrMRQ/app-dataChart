import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollPosicaoService {
  
  posicao:any;

  constructor(

  ) { }

  public salvarClick(event:any){
    this.posicao = event.view.pageYOffset
    localStorage.setItem("posicao",this.posicao);
   }

}

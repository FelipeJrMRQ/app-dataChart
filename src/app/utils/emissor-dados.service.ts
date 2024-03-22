import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmissorDadosService {

  static emitirDados = new EventEmitter<any>();
  constructor() { }
}

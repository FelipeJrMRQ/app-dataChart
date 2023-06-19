import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Retorna o endereço aproximado do usuário com base nas informações fornecidas
   * @param latitude 
   * @param longitude 
   */
  public obterEnderecoDeAcesso(latitude: any, longitude: any){
    let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyARse-Sm7KLNFYk9c7QYOuzScm89VA3b9Y`;
      this.http.get(url).subscribe({
        next:(res)=>{
          console.log(res);
        },
        error:(e)=>{
          console.log(e);
        }
      })
  }
}

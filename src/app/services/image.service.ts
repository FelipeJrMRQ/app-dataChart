import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  private urlApi:string = `${environment.urlApi}/img`;

  constructor(
    private http: HttpClient
  ) { }

   public downloadImg(nomeImagem: string):Observable<Blob>{
       return  this.http.get(`${this.urlApi}/${nomeImagem}`, {responseType: 'blob'});
   }
}

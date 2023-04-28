import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  versaoApp: string = environment.versaoApp;
  usuario: Usuario;

  constructor(
    private loginService: LoginService,
  ) { 
    this.usuario = new Usuario;
  }

  ngOnInit(): void {
    UsuarioService.usuarioAutenticado.subscribe(res=>{
        this.usuario = res;
    });  
    LoginService.informarLogout.subscribe(res=>{
       this.usuario = new Usuario(); 
    });
  }

  public exibirRodapeSeAutenticado(): boolean{
    if(this.usuario.nome != undefined){
      return true;
    }else{
      return false;
    }
  }

}

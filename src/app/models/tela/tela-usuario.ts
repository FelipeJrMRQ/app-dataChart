import { Usuario } from "../usuario";
import { ComponenteTela } from "./componente-tela";

export class TelaUsuario{
    id: number = 0;
    nome: string = "";
    rota: string = ""; 
    usuario: Usuario = new Usuario(); 
    componentes: ComponenteTela[] = [];
}
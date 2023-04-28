import { Usuario } from "../usuario";


export class LogSistema{
    id: number ;
    descricao: string;
    data: Date = new Date();
    usuario: Usuario;

    constructor(id: any, descricao: string, usuario: Usuario){
        this.id = id;
        this.usuario = usuario;
        this.descricao = descricao;
    }
}

import { Usuario } from "../usuario";


export class LogSistema{
    id: number ;
    descricao: string;
    tela: string;
    data: Date = new Date();
    usuario: Usuario;

    constructor(id: any, descricao: string, usuario: Usuario, tela: string){
        this.id = id;
        this.usuario = usuario;
        this.descricao = descricao;
        this.tela = tela;
    }
}

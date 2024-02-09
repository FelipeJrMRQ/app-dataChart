import * as moment from "moment";
import { Usuario } from "../usuario";
import "moment-timezone";


export class LogSistema{
    id: number ;
    descricao: string;
    tela: string;
    data: any;
    usuario: Usuario;

    constructor(id: any, descricao: string, usuario: Usuario, tela: string){
        this.id = id;
        this.usuario = usuario;
        this.descricao = descricao;
        this.tela = tela;
        this.data = moment(this.data).tz('America/Sao_Paulo').toDate();
    }
}

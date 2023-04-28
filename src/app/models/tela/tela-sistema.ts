import { Usuario } from "../usuario";
import { ComponenteTela } from "./componente-tela";

export class TelaSistema{
    id: number = 0;
    nome: string = "";
    rota:string = "";
    componentes: ComponenteTela[] = [];
}
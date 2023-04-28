import { Permissoes } from "./permissoes-usuario";

export class Usuario{
    id: number | undefined;
    username: string | undefined;
    password: string | undefined;
    nome: string | undefined;
    contaAtiva: boolean = false;
}
import { Permissoes } from "./permissoes-usuario";

export class UsuuarioDTO{
    id: number | undefined;
    nome: string | undefined;
    email: string | undefined;
    contaAtiva: boolean  = false;
}
import { Permissoes } from "./permissoes-usuario";

export class UsuarioDTO{
    id: number | undefined;
    nome: string | undefined;
    email: string | undefined;
    contaAtiva: boolean  = false;
    notificacao: boolean = false;
}

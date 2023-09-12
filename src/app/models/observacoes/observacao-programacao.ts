import { Motivo } from "../motivo";

export class ObservacaoProgramacao {
    id: number | undefined;
    motivo: Motivo = new Motivo();
    observacaoApontamento: string | undefined;
    bloqueio: boolean | undefined;
    data: string | undefined;
}

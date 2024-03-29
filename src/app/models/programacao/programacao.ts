import { LinhaDeProducao } from "../linha-de-producao";
import { ObservacaoProgramacao } from "../observacoes/observacao-programacao";

import { Turno } from "../turno";

export class Programacao {
    id: number | undefined;
    cdProduto: number | undefined;
    nomeProduto: string | undefined;
    cdCliente: number | undefined;
    nomeCliente: string | undefined;
    cdBeneficiamento: number | undefined;
    nomeBeneficiamento: any | undefined;
    qtdeProgramada: number | undefined;
    observacao: string | undefined;
    turno: Turno = new Turno();
    linhaDeProducao = new LinhaDeProducao();
    espessura: number | undefined;
    responsavel: string | undefined;
    prioridade: number | undefined;
    data: string | undefined;
    dataInclusao: Date | undefined;
    dataEntrada: string | undefined;
    inicioProducao: Date | undefined;
    fimProducao: Date | undefined;
    status: any | undefined;
    item: any;
    cdEntrada: any;
    valorPrevisto: any;
    sequencia: number | undefined;
    setup: number | undefined;
    sequenciaSetup: number | undefined;
    saldoAntigo: number | undefined;
    observacoes: ObservacaoProgramacao[] = []
}

import { LinhaDeProducao } from "./linha-de-producao";
import { Turno } from "./turno";

export class Programacao{
    id: number | undefined;
    cdProduto: number | undefined;
    nomeProduto: string | undefined;
    cdCliente: number | undefined;
    nomeCliente: string | undefined;
    cdBeneficiamento: number | undefined;
    nomeBeneficiamento: string | undefined;
    qtdeProgramada: number | undefined;
    observacao: string | undefined;
    turno: Turno = new Turno();
    linhaDeProducao = new  LinhaDeProducao();
    espessura: number | undefined;
    responsavel: string | undefined;
    prioridade: number | undefined;
    data: string | undefined;
    status: any | undefined;
    item: any;
    cdEntrada: any;
    valorPrevisto: any;
}

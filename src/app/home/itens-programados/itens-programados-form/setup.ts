import { Programacao } from "src/app/models/programacao";

export class Setup{
    nomeBeneficiamento: string | undefined;
    setup: number | undefined;
    itensProgramados: Programacao[] = [];
}

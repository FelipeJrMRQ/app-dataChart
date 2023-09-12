import { Programacao } from "src/app/models/programacao/programacao";

export class Setup{
    nomeBeneficiamento: string | undefined;
    setup: number | undefined;
    sequenciaSetup: number | undefined;
    itensProgramados: Programacao[] = [];
}

import { LinhaDeProducao } from "src/app/models/linha-de-producao";
import { Programacao } from 'src/app/models/programacao';
import { Turno } from "src/app/models/turno";

export class ItensLinha{
    linhaDeProducao: LinhaDeProducao = new LinhaDeProducao();
    itensProgramados: Programacao[] = [];
    valorPrevisto: number = 0;
    turno: Turno = new Turno();
}

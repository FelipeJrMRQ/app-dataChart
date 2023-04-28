import * as moment from "moment";

export class ModeloConsulta{

    id:number | undefined;
    nome:string |undefined;
    dataInicial:string | undefined;
    dataFinal:string | undefined;
    tipoConsulta:string | undefined;
    cdCliente:number | undefined;


    public getInstance(dataInicial: string, dataFinal: string, tipoConsulta: string, nome: string | "", id: number | undefined){
         this.dataInicial = moment(dataInicial).format('yyyy-MM-DD');
         this.dataFinal = moment(dataFinal).format('yyyy-MM-DD');
         this.tipoConsulta = tipoConsulta;
         this.nome = nome;
         this.id = id;
         return this;      
    }

}

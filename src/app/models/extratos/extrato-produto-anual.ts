import { MesQuantidade } from "./extrato-mes-quantidade";

export class ExtratoProdutoAnual{
    cdProduto: number;
    nomeProduto: string;
    nomeBeneficiamento: string;
    valor: number;
    valorTotal: any = 0;
    qtdeTotal: any = 0;
    meses:MesQuantidade[] = [];
    

    constructor(cdProduto: number, nomeProduto:string, nomeBeneficiamento: string, valor: number, meses: MesQuantidade[]){
        this.cdProduto = cdProduto;
        this.nomeProduto = nomeProduto;
        this.meses = meses;
        this.valor = valor;
        this.nomeBeneficiamento = nomeBeneficiamento;
    }
}
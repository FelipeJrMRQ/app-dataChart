export class ExtratoProduto {
    cdCliente: number;
    nomeCliente: string;
    cdProduto: any;
    nomeProduto: string;
    cdBeneficiamento: number;
    nomeBeneficiamento: string;
    mes: number;
    ano: number;
    quantidade: number;
    valorUnitario: number;
    valor: number;

    constructor(
        cdCliente: number,
        nomeCliente: string,
        cdProduto: number,
        nomeProduto: string,
        cdBeneficiamento: number,
        nomeBeneficiamento: string,
        mes: number,
        ano:number,
        quantidade: number,
        valorUnitario: number,
        valor: number) {
        this.cdCliente = cdCliente;
        this.nomeCliente = nomeCliente;
        this.cdProduto = cdProduto;
        this.nomeCliente = nomeCliente;
        this.nomeProduto = nomeProduto;
        this.cdBeneficiamento = cdBeneficiamento;
        this.nomeBeneficiamento = nomeBeneficiamento;
        this.mes = mes;
        this.quantidade = quantidade;
        this.valorUnitario = valorUnitario;
        this.valor = valor;
        this.ano = ano;
    }

}
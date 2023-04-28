export class Permissoes{
    id: number | undefined;
	parametrosDia: boolean = false;
	parametrosMes: boolean = false;
	parametrosFaturamento: boolean = false;
	mediaFaturamento: boolean = false;
	carteiraCliente: boolean = false;
	exportarDadosCarteiraCliente: boolean = false;
	detalhesCarteiraCliente: boolean = false;
	carteiraBeneficiamento: boolean = false;
	exportarDadosCarteiraBeneficiamento: boolean = false;
	detalhesCarteiraBeneficiamento: boolean = false;
	faturamentoDiario: boolean = false;
	detalhesFaturamentoDiario: boolean = false;
	exportarDadosFaturamentoDiario: boolean = false;
	entradaDiaria: boolean = false;
	detalhesEntradaDiaria: boolean = false;
	exportarDadosEntradaDiaria: boolean = false;
	alterarMeta: boolean = false;
	atualizarInformacoes: boolean = false;
	cadastrarUsuario: boolean = false;
	detalhesFaturamentoMensal = false;
	valorOrcamento: boolean = false;
	programacao: boolean = false;
	itensProgramados: boolean = false;
	homePage: string = "";
}
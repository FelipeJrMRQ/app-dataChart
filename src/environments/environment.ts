// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApi: "http://125.67.2.9:8080/api",
  obterToken: "http://125.67.2.9:8080/login",
  versaoApp: '1.42.25',
};

/**
 * ########## --------- Historico de altualizações ---------- ############
 * 
 * 
 * #   Descrição do modelo de versionamento 
 * #   x . x . x
 * #   |   |   |
 * #   |   |   |
 * #   |   |   |-->  Indica a correção de bugs 
 * #   |   |
 * #   |   |--> Indica adição ou exclusao de novas funcionalidades
 * #   |
 * #   |--> Indica alteração de tecnologia ou versao do angular
 * 
 * Versão 1.26.14
 * Inclusão do registro de logs
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.27.14
 * Inclusão da imagem de perfil
 * Inclusão do método para alteração de senha
 * Inclusão da visualização de logs de atividades do sistema
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.27.15
 * Correção na recuperacão da imagem de perfil que não carregava quando o usuário realizava autenticação.
 * Substituição do nome do usuário por uma icone de configuração
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.27.16
 * Correção na exibição dos itens na tela de programação após o filtro o sistema estava exibindo a tabela sem filtro
 * e com filtro ao mesmo tempo
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.28.16
 * Alteração no módulo de programação de itens para realizar as programaçoes por linhas e gerar um arquivo PDF
 * para cada linha programada
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.29.17
 * Alteração no módulo de programação para possibilidade de setup misto com multiplos beneficiamentos.
 * Permissão de exclusão completa do setup
 * Permissão de alteração da sequência do setup e dos itens do setup.
 * Alteração de linha de produção ou turno so setup existente.
 *
 * Correção do bug de redirecionamento no botação voltar na tela de cofiguração de metas
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.30.18
 * Criação da tela de detalhes do cliente com informativo completo sobre
 * Entradas
 * Faturamento
 * Medias
 * Historicos completos do ano sobre um cliente
 * Criação do sistema de notificação dashbot
 *
 * Correção do bug do valor de faturamento que só considerava notas fiscais com produtos
 * A partir desta versão o sistema considera outras formas de futuramento
 *
 * Exemplo: Nota fiscal de venda de máquinas
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.31.18
 * Criação do modelo de notificação do usuário via web
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.32.18
 * Inclusao do campo de data para consulta por data no detalhamento do cliente
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.33.18
 * Inclusão do módulo de novos negocios
 * Tabela com novos itens do mês
 * Grafico de incidencia de novos negocios
 * Exportação da tabela de novos itens do mês
 * Inclusão da tabela de produtos no banco de dados
 * Inclusão da funçao atualiza cadastro de produtos
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.34.19
 * Alteração na exibição das permissões no cadastro de usuários
 * Criação do atualizador de notas fiscais canceladas
 * Inclusão de visualização de detalhes do produto na tela de detalhamentos do cliente
 * Exclusão do botões extrato entra, extrado faturamento em datalhamento do cliente
 * Correção no procedimento de atualização do cadastro de produtos para deixar o procedimento mais rápido
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.34.20
 * Identificação do erro de comunicação com a socket ao realizar operações com novas instacias
 * da socket o sistema apresentava violação de acesso as threads com isso foi possível perceber
 * que seria necessário que o sistema gerenciasse apenas uma instancia de da sockect de conexão
 * com access, para isso foi criada uma fabrica de conexão que gerencia apenas uma instancia
 * durante todo uso da aplicação.
 *
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.35.20
 * Inclusão do método de recuperação de senha através da tela de login
 * Inclusão do método de notificação por e-mail quando as metas de faturamento
 * não forem definidas antecipadamento
 *
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.36.21
 * Inclusão dos totais no módulo análitico no relatório produção por beneficiamento
 * Correção do bug no cadastro de usuário onde havia uma janela de carregamento infinito
 * Alteração do logotipo e inclusão dele nos emails de notificação
 * Alteração no campos das tabelas de carteira alterando de área para área acumulada e preço para valor
 * unitário
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.37.21
 * Inclusao da tela de administração para visualização de logs do sistema e acessos
 *
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.38.21
 * Inclusao do grafico de movimentação de produtos em dashboard sintetico
 * Inclusao da tabela de movimentoção de produtos por cliente em dashboard sintetico
 * Inclusao da tabela de movimentação por produto em detalhamento cliente
 * Inclusao da função de exportar dados de movimentação por cliente e produto
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.39.21
 * Inclusão da tela de faturamento de clientes por periodo
 * Visualização de detalhe do periodo selecionado
 * Exportação de dados do periodo selecionado
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.39.23
 * Correção no bug de exibição da tabela de histórico anual de entrada
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.40.23
 * Inclusão da consulta do extrato de faturamento e entrada por beneficiamento na tela de detalhamento do cliente.
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.41.24
 * Inclusão filtro de consulta nas telas de carteira por cliente e por beneficiamento
 * Correção no métodos de filtro da tela de faturamento do mês
 * Redução de codigo ao aplicar novos métodos de filtro
 *
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.42.24
 * Inclusão da visualização de produtos do beneficiamento nas telas de:
 * Extrato anual entrada
 * Extrato anual faturamento
 * 
 * -------------------------------------------------------------------------------------------------------------------
 * Versão 1.42.25
 * Correção na ordenação das colunas no historico anual de faturamento
 * Correção na ordenação das colunas no historico anual de entradas
 * 
 */



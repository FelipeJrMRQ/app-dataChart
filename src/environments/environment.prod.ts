export const environment = {
  production: true,
  urlApi: "http://125.67.2.242:8083/api",
  obterToken: "http://125.67.2.242:8083/login",
  versaoApp: '1.31.18'
};

/**
 * ########## --------- Historico de altualizações ---------- ############ 
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
 * 
 * 
 * 
 */

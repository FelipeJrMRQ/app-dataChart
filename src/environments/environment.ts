// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  urlApi: "http://125.67.2.20:8083/api",
  obterToken: "http://125.67.2.20:8083/login",
  versaoApp: '1.28.16'
};

/**
 * ########## --------- Historico de altualizações ---------- ############ 
 * 
 * Versão 1.26.14 
 * Inclusão do registro de logs
 * 
 * ----------------------------------------------------------------------------------------------------------------
 * Versão 1.27.14
 * Inclusão da imagem de perfil
 * Inclusão do método para alteração de senha
 * Inclusão da visualização de logs de atividades do sistema
 * 
 * ----------------------------------------------------------------------------------------------------------------
 * Versão 1.27.15 
 * Correção na recuperacão da imagem de perfil que não carregava quando o usuário realizava autenticação.
 * Substituição do nome do usuário por uma icone de configuração
 * 
 * ----------------------------------------------------------------------------------------------------------------
 * Versão 1.28.16 
 * Alteração no módulo de programação de itens para realizar as programaçoes por linhas e gerar um arquivo PDF 
 * para cada linha programada
 * 
 * 
 * 
 */

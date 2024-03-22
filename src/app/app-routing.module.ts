import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './guards/auth-guard.service';

const routes: Routes = [
  { path: '', loadChildren: () => import('../app/security/login/login.module').then(l => l.LoginModule) },
  { path: 'dashboard-analitico', loadChildren: () => import('./home/dashboard-analitico/dashboard-analitico.module').then(d => d.DashboardModule), canActivate: [AuthGuardService] },
  { path: 'cadastro-usuario', loadChildren: () => import('../app/home/usuario/usuario-routing.module').then(u => u.UsuarioRoutingModule)},
  { path: 'configurar-meta', loadChildren: () => import('./home/config/config-parametros/parametros-meta.module').then(c => c.ParametrosMetaModule), canActivate: [AuthGuardService] },
  { path: 'teste', loadChildren: () => import('./home/teste/teste.module').then(t => t.TesteModule) },
  { path: 'atualizar-informacoes', loadChildren: () => import('./home/atualizador/atualizador.module').then(a => a.AtualizadorModule), canActivate: [AuthGuardService] },
  { path: 'faturamento-diario/:data', loadChildren: () => import('./home/faturamento-diario/faturamento.module').then(f => f.FaturamentoModule), canActivate: [AuthGuardService] },
  { path: 'entrada', loadChildren: () => import('./home/entrada/entrada.module').then(e => e.EntradaModule), canActivate: [AuthGuardService]  },
  { path: 'carteira-beneficiamento/:cdBeneficiamento/:data/:nome', loadChildren: () => import('./home/carteira-beneficiamento/carteira-beneficiamento.module').then(c => c.CarteiraBeneficiamentoModule), canActivate: [AuthGuardService] },
  { path: 'carteira-cliente/:cdCliente/:data/:nomeCliente', loadChildren: () => import('./home/carteira-cliente/carteira-cliente.module').then(c => c.CarteiraClienteModule), canActivate: [AuthGuardService] },
  { path: 'faturamento-mensal/:data', loadChildren: () => import('./home/faturamento-mensal/faturamento-mensal.module').then(f => f.FaturamentoMensalModule), canActivate: [AuthGuardService] },
  { path: 'validar-convite', loadChildren: () => import('./home/convite/convite.module').then(f => f.ConviteModule) },
  { path: 'programacao', loadChildren: () => import('./home/programacao/programacao.module').then(p => p.ProgramacaoModule), canActivate: [AuthGuardService] },
  { path: 'itens-programados', loadChildren: () => import('./home/itens-programados/itens-programados.module').then(i => i.ItensProgramadosModule), canActivate: [AuthGuardService] },
  { path: 'configurar-telas', loadChildren: () => import('./home/config/config-tela/config-tela.module').then(i => i.ConfigTelaModule), canActivate: [AuthGuardService] },
  { path: 'dashboard-sintetico', loadChildren: () => import('./home/dashboard-sintetico/dashboard-sintetico.module').then(i => i.DashboardSinteticoModule), canActivate: [AuthGuardService]},
  { path: 'detalhamento-cliente/:cdCliente/:nomeCliente/:data', loadChildren:()=> import('./home/detalhamento-cliente/detalhamento-cliente.module').then(i=>i.DetalhamentoClienteModule), canActivate: [AuthGuardService]},
  { path: 'detalhamento-cliente/:cdCliente/:nomeCliente/:data/:meses', loadChildren:()=> import('./home/detalhamento-cliente/detalhamento-cliente.module').then(i=>i.DetalhamentoClienteModule), canActivate: [AuthGuardService]},
  { path: 'notificacao', loadChildren:()=> import ('./home/notificacao/notificacao.module').then(i => i.NotificacaoModule),canActivate: [AuthGuardService]},
  { path: 'administracao', loadChildren:()=> import('./home/config/administracao/administracao.module').then(i => i.AdministracaoModule), canActivate: [AuthGuardService]},
  { path: 'faturamento-periodo', loadChildren:()=> import('./home/faturamento-periodo/faturamento-periodo.module').then(i => i.FaturamentoPeriodoModule), canActivate: [AuthGuardService]},
  { path: 'gestao' , loadChildren:()=> import('./home/dashboard-gestao/dashboard-gestao.module').then(i => i.DashboardGestaoModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

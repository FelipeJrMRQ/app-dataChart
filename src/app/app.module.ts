import { SortableModule } from 'ngx-bootstrap/sortable';
import { LoginService } from './services/login.service';
import { LoginModule } from './security/login/login.module';
import { ModalModule } from './shared/modal/modal.module';
import { FeriadoService } from './services/feriado.service';
import { ClienteService } from './services/cliente.service';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParametrosMetaModule } from './home/config/config-parametros/parametros-meta.module';
import { FaturamentoService } from './services/faturamento.service';
import { TemplateModule } from './template/template.module';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParametrosMetaService } from './services/parametros-meta.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { TesteRoutingModule } from './home/teste/teste-routing.module';
import { MetaProjetadaService } from './services/meta-projetada.service';
import { MetaDiariaService } from './services/meta-diaria.service';
import { AtualizadorService } from './services/atualizador.service';
import { BeneficiamentoService } from './services/beneficiamento.service';
import { EntradaModule } from './home/entrada/entrada.module';
import { EntradaService } from './services/entrada.service';
import { AutenticacaoService } from './services/autenticacao.service';
import { CarteiraBeneficiamentoModule } from './home/carteira-beneficiamento/carteira-beneficiamento.module';
import { CarteiraClienteModule } from './home/carteira-cliente/carteira-cliente.module';
import { EntradaRoutingModule } from './home/entrada/entrada-routing.module';
import { FaturamentoMensalModule } from './home/faturamento-mensal/faturamento-mensal.module';
import { DialogModule } from './shared/dialog/dialog.module';
import { TokenInterceptor } from './guards/token.interceptor';
import { DateControllerService } from './utils/date-controller.service';
import { UsuarioService } from './services/usuario.service';
import { UsuarioModule } from './home/usuario/usuario.module';
import { ProdutoService } from './services/produto.service';
import { ConfigTelaModule } from './home/config/config-tela/config-tela.module';
import { TelaSistemaService } from './services/telas/tela-sistema.service';
import { DashboardModule } from './home/dashboard-analitico/dashboard-analitico.module';



registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TemplateModule,
    BrowserAnimationsModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSliderModule,
    NgxPaginationModule,
    MatSnackBarModule,
    ParametrosMetaModule,
    TesteRoutingModule,
    EntradaRoutingModule,
    EntradaModule,
    ModalModule,
    CarteiraBeneficiamentoModule,
    CarteiraClienteModule,
    FaturamentoMensalModule,
    DialogModule,
    LoginModule,
    ReactiveFormsModule,
    UsuarioModule,
    SortableModule,
    ConfigTelaModule,
    DashboardModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-br' },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    FaturamentoService,
    ParametrosMetaService,
    ClienteService,
    MetaProjetadaService,
    MetaDiariaService,
    FeriadoService,
    AtualizadorService,
    BeneficiamentoService,
    EntradaService,
    AutenticacaoService,
    LoginService,
    DateControllerService,
    UsuarioService,
    ProdutoService,
    TelaSistemaService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ControleExibicaoService } from 'src/app/services/permissoes-componentes/controle-exibicao.service';
import { ScrollPosicaoService } from 'src/app/services/scroll-posicao.service';
import { UsuarioService } from 'src/app/services/usuario.service';


Chart.register(...registerables);

@Component({
    selector: 'app-dashboard-analitico',
    templateUrl: './dashboard-analitico.component.html',
    styleUrls: ['./dashboard-analitico.component.css']
})
export class DashboardAnaliticoComponent implements OnInit {

    scroll: any;
    posicao: any

    constructor(
        private scrollPosicao: ScrollPosicaoService,
        private controleExibicaoService: ControleExibicaoService,
    ) {

    }

    ngOnInit() {
        this.esconderBotao();
        this.registrarLog();
    }

    private registrarLog(){
        this.controleExibicaoService.registrarLog("ACESSOU A TELA DASHBOARD ANALITICO", 'DASHBOARD ANALITICO');
    }

    public VoltarTopo() {
        setTimeout(() => {
            localStorage.setItem("posicao","0");
        }, 100);
        window.scrollTo(0, 0);
    }

    public salvarClick(event: any) {
        this.scrollPosicao.salvarClick(event);
    }

    public esconderBotao() {
        this.scroll = new IntersectionObserver(e => {
            Array.from(e).forEach(dados => {
                if (dados.intersectionRatio >= 1) {
                    dados.target.classList.add('icone')
                }
            })
        }, {
            threshold: [1]
        })
        Array.from(document.querySelectorAll('.esconder')).forEach(element => {
            this.scroll.observe(element)
        });
    }
}

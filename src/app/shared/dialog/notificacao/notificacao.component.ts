import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacaoService } from 'src/app/services/notificacao.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.css']
})
export class NotificacaoComponent implements OnInit {

  btnClose = true;
  contador = 5;
  versaoApp: any = environment.versaoApp;

  msg: any = '';

  constructor(
    private dialogRef: MatDialogRef<NotificacaoComponent>,
    private notificacaoService: NotificacaoService,
  ) { }

  ngOnInit(): void {
    this.consultarNotificacao();
  }

  fecharDialogo() {
    this.dialogRef.close();
  }

  private consultarNotificacao() {
    this.notificacaoService.consultarNotificacao(1).subscribe({
        next:(res)=>{
          this.msg = res.mensagem;
        },
        complete:()=>{
          this.controlarExibicaoDoBotaoFechar();
        }
    });
  }

  private controlarExibicaoDoBotaoFechar(){
    let i = setInterval(() => {
      if (this.contador != 0) {
        this.contador--;
        if (this.contador == 0) {
          this.btnClose = false;
          clearInterval(i);
        }
      }
    }, 1000);
  }

}

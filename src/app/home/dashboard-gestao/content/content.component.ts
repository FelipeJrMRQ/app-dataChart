import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateControllerService } from 'src/app/utils/date-controller.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {


  dataAtual: any;

  constructor() { }

  ngOnInit(): void {
    this.dataAtual = moment().format('yyyy-MM-DD');
  }

  public emitirData(){
    DateControllerService.emitirData.emit(this.dataAtual);
  }

}

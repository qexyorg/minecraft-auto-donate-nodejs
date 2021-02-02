import { Component, OnInit } from '@angular/core';
import { GlobalScopeService } from "../services/global-scope.service";
import {WebsocketService} from "../websocket.service";
import { Router } from '@angular/router';
import {ClipboardService} from "ngx-clipboard";

declare let pipui: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  paydata: any = {
    login: '',
    item_id: -1,
    accept: true
  };

  online: number = -1;

  paylock: boolean = false;

  constructor(public globals: GlobalScopeService, private socket: WebsocketService, private router: Router, private _clipboardService: ClipboardService) { }

  ngOnInit(): void {
    let self = this;

    self.socket.listen('online').subscribe(function(data: number){
      self.online = data;
    });
  }

  copyip(e: any){
    e.preventDefault();

    e.target.disabled = true;

    let text = e.target.innerHTML;

    e.target.innerHTML = 'Скопировано!';

    setTimeout(function(){
      e.target.innerHTML = text;
      e.target.disabled = false;
    }, 1000);

    this._clipboardService.copy(e.target.attributes['data-copy-text'].nodeValue)
  }

  pay(e) {
    e.preventDefault();

    let self = this;

    if(typeof self.globals.options.items[self.paydata.item_id] == "undefined"){
      return pipui.alert.open('Привилегия указана неверно', 'Внимание!');
    }

    if(!self.paydata.login.length){
      return pipui.alert.open('Необходимо указать никнейм игрока', 'Внимание!');
    }

    if(!self.paydata.accept){
      return pipui.alert.open('Необходимо принять правила сайта', 'Внимание!');
    }

    self.paylock = true;

    self.socket.emit('pay', self.paydata, function(text: string = '', title: string = '', type: boolean = false){
      if(typeof text != 'string'){
          console.log(text);
          self.paylock = false;
          return pipui.alert.open('Произошла ошибка получения данных. Повторите попытку или обратитесь к администрации', 'Ошибка!');
      }

      if(!type){ self.paylock = false; return pipui.alert.open(text, title, type); }

      location.href = text;
    });
  }

}

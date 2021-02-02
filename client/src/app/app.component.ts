import {Component, OnInit } from '@angular/core';
import {WebsocketService} from "./websocket.service";
import { GlobalScopeService } from "./services/global-scope.service";

declare let pipui: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private socket: WebsocketService, public globals: GlobalScopeService) {
  }

  ngOnInit(): void {
    let self = this;

    self.socket.listen('error').subscribe(function(data: any){
      pipui.alert.open(data.text, data.title);
    });

    self.socket.listen('options').subscribe(function(options){
      self.globals.options = options;
    });

    self.socket.listen('clients').subscribe(function(clients: number){
      self.globals.clients = clients;
    });

    self.socket.listen('last').subscribe(function(list: any){
      self.globals.last = list;
    });

    self.socket.listen('last-broadcast').subscribe(function(item: any){
      self.globals.last.unshift(item);

      if(self.globals.last.length > 10){
        self.globals.last.splice(-1,1);
      }
    });
  }
}

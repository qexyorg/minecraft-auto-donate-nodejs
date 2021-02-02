import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  socket: any;
  readonly req: string = "http://localhost:8000";

  constructor() {
    this.socket = io(this.req);
  }

  listen(eventName: string){
    let self = this;

    return new Observable(function(subscriber){

      self.socket.on(eventName, function(data){
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any, callback){
    this.socket.emit(eventName, data, callback);
  }
}

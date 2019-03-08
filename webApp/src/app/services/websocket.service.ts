import { Injectable } from '@angular/core';
import { Subject, Observable, Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';

export enum Event {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect'
}
const SERVER_URL = 'http://localhost:2020/itemws/';
export interface Message {
  itemId: string;
  playerId: string;
}

@Injectable()
// export class WebsocketService {
  // private socket;

  // constructor() { }

  // connect(): Subject<MessageEvent> {
  //   // If you aren't familiar with environment variables then
  //   // you can hard code `environment.ws_url` as `http://localhost:5000`
  //   this.socket = socketIo(SERVER_URL);

  //   // We define our observable which will observe any incoming messages
  //   // from our socket.io server.
  //   let observable = new Observable(observer => {
  //       this.socket.on('message', (data) => {
  //         console.log("Received message from Websocket Server")
  //         observer.next(data);
  //       })
  //       return () => {
  //         this.socket.disconnect();
  //       }
  //   });

  //   // We define our Observer which will listen to messages
  //   // from our other components and send messages back to our
  //   // socket server whenever the `next()` method is called.
  //   let observer = {
  //       next: (data: Object) => {
  //           this.socket.emit('message', JSON.stringify(data));
  //       },
  //   };

  //   // we return our Rx.Subject which is a combination
  //   // of both an observer and observable.
  //   return Subject.create(observer, observable);
  // }
    // private socket;

    // public initSocket(): void {
    //     this.socket = socketIo(SERVER_URL);
    // }

    // public send(message: Message): void {
    //     this.socket.emit('message', message);
    // }

    // public onMessage(): Observable<Message> {
    //     return new Observable<Message>(observer => {
    //         this.socket.on('message', (data: Message) => observer.next(data));
    //     });
    // }

    // public onEvent(event: Event): Observable<any> {
    //     return new Observable<Event>(observer => {
    //         this.socket.on(event, () => observer.next());
    //     });
    // }

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private observable: Observable<MessageEvent>;
  private observer: Subject<Message>;

  constructor() {

    const socket = new WebSocket('ws://localhost:2020/itemws/websocket');

    this.observable = Observable.create(
      (observer: Observer<MessageEvent>) => {
        socket.onmessage = observer.next.bind(observer);
        socket.onerror = observer.error.bind(observer);
        socket.onclose = observer.complete.bind(observer);
        return socket.close.bind(socket);
      }
    );

    this.observer = Subject.create({
      next: (data: Message) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    });

  }

  observeClient(): Observable<MessageEvent> {
    return this.observable;
  }
  // constructor() { }
  // private subject: Subject<MessageEvent>;

  // public connect(url): Subject<MessageEvent> {
  //   if (!this.subject) {
  //     this.subject = this.create(url);
  //     console.log("Successfully connected: " + url);
  //   }
  //   return this.subject;
  // }

  // private create(url): Subject<MessageEvent> {
  //   let ws = new WebSocket(url);

  //   let observable = Observable.create((obs: Observer<MessageEvent>) => {
  //     ws.onmessage = obs.next.bind(obs);
  //     ws.onerror = obs.error.bind(obs);
  //     ws.onclose = obs.complete.bind(obs);
  //     return ws.close.bind(ws);
  //   });
  //   let observer = {
  //     next: (data: Object) => {
  //       if (ws.readyState === WebSocket.OPEN) {
  //         ws.send(JSON.stringify(data));
  //       }
  //     }
  //   };
  //   return Subject.create(observer, observable);
  // }
 }

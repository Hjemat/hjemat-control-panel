import {Injectable}     from '@angular/core';
import {Device}         from './device';
import {Observable}     from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

@Injectable()
export class WebSocketService {
    constructor(private http: Http) { }
    private _webSocketUrl = 'ws://192.168.1.177:8010/';  // URL to web api

    public webSocket: WebSocket = new WebSocket(this._webSocketUrl); 

    sendCommand(deviceID: number, valueID: number, value: number) {
        let message = JSON.stringify({ "commandType": 1, deviceID, valueID, value });

        return this.webSocket.send(message);
    }
}

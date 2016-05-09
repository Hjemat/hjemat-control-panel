import {Injectable}     from '@angular/core';
import {Device}         from './device';
import {Observable}     from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

@Injectable()
export class WebSocketService {
    constructor(private http: Http) { }
    private _webSocketUrl = 'ws://10.130.145.165:8010/';  // URL to web api

    public webSocket: WebSocket = new WebSocket(this._webSocketUrl);

    sendCommand(deviceID: number, valueID: number, value: number) {
        let message = JSON.stringify({ "commandType": 1, deviceID, valueID, value });

        return this.webSocket.send(message);
    }

    requestValue(deviceID: number, valueID: number) {
        let message = JSON.stringify({ "commandType": 3, deviceID, valueID });

        return this.webSocket.send(message);
    }

    beginPair() {
        let message = JSON.stringify({ "commandType": 4, "confirmation": 0 });

        return this.webSocket.send(message);
    }

    endPair() {
        let message = JSON.stringify({ "commandType": 5, "confirmation": 0 });

        return this.webSocket.send(message);
    }
    
    isConnected(): boolean {
        return this.webSocket.readyState === WebSocket.OPEN;
    }
}
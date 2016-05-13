import {Injectable, EventEmitter, Output }     from '@angular/core';
import {Device}         from './device';
import {Observable}     from 'rxjs/Observable';
import {Http, Response} from '@angular/http';

@Injectable()
export class WebSocketService {
    constructor(private http: Http) { }
    private _webSocketUrl = 'ws://10.130.145.165:8010/';  // URL to web api

    public webSocket: WebSocket = new WebSocket(this._webSocketUrl);

    @Output() open: EventEmitter<any> = new EventEmitter();
    @Output() close: EventEmitter<any> = new EventEmitter();
    @Output() message: EventEmitter<any> = new EventEmitter();

    sendCommand(deviceID: number, valueID: number, value: number) {
        let message = JSON.stringify({ "commandType": 1, deviceID, valueID, value });

        return this.webSocket.send(message);
    }

    requestValue(deviceID: number, valueID: number) {
        let message = JSON.stringify({ "commandType": 3, deviceID, valueID });

        return this.webSocket.send(message);
    }

    refreshDevices() {
        let message = JSON.stringify({ "commandType": 6, "confirmation": 0 });

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

    isOpen(): boolean {
        return this.webSocket.readyState === WebSocket.OPEN;
    }

    isConnecting(): boolean {
        return this.webSocket.readyState === WebSocket.CONNECTING;
    }



    connect() {
        if (!this.isOpen() && !this.isConnecting()) {
            this.webSocket = new WebSocket(this._webSocketUrl);
            this.setupEmitters();
        }
        else {
            this.setupEmitters();
        }
    }

    setupEmitters() {
        this.webSocket.addEventListener("open", ev => { this.open.emit(ev); console.log("open"); });
        this.webSocket.addEventListener("close", ev => { this.close.emit(ev); console.log("close"); });
        this.webSocket.addEventListener("message", ev => { this.message.emit(ev); console.log("message"); });
    }
}
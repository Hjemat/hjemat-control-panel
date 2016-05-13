import {Component, OnInit } from '@angular/core';
import {Device} from './device';
import {Product} from './product';
import { DeviceCustomization } from './device-customization';
import { DeviceService } from './device.service';
import { ProductService } from './product.service';
import { WebSocketService} from './websocket.service';
import { DeviceCustomizationService } from './device-customization.service';
import { MdSpinner } from '@angular2-material/progress-circle';
import { MdButton } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

@Component({
    selector: 'device-pair',
    templateUrl: 'app/device-pair.component.html',
    //styleUrls: ['app/device-detail.component.css'],
    directives: [
        MdSpinner,
        MdButton,
        MD_INPUT_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MdIcon],
    providers: [
        MdIconRegistry
    ]
})
export class DevicePairComponent implements OnInit {
    constructor(
        private deviceService: DeviceService,
        private productService: ProductService,
        private webSocketService: WebSocketService,
        private dcService: DeviceCustomizationService) {
    }

    devices: Device[] = [];
    products: { [id: number]: Product };
    errorMessage: string;
    deviceCustomization: DeviceCustomization;
    connectionStatus: string = "Not connected to server";
    showConnectionStatus: boolean = true;
    showRetry: boolean = false;

    disconnectedString: string = "Lost connection to server";
    connectingString: string = "Connecting to server...";
    notConnectedString: string = "Not connected to server";

    isConnected: boolean = false;


    unknownProduct: Product = new Product();

    pairing: boolean = false;

    ngOnInit() {
        this.webSocketService.connect();

        if (this.webSocketService.isOpen()) {
            this.showRetry = false;
            this.isConnected = true;
        }
        else if (this.webSocketService.isConnecting()) {
            this.showRetry = false;

            this.connectionStatus = this.connectingString;
            this.isConnected = false;
        }
        else {
            this.showRetry = true;

            this.connectionStatus = this.notConnectedString;
            this.isConnected = false;
        }

        this.unknownProduct.name = "Unknown Device";
        this.unknownProduct.description = "An unknown product";

        this.webSocketService.message.subscribe(ev => this.onMessage(ev));
        this.webSocketService.open.subscribe(ev => {
            this.showRetry = false;
            this.isConnected = true;
        });
        
        this.webSocketService.close.subscribe(ev => {
            this.connectionStatus = this.disconnectedString;
            this.showRetry = true;
            this.pairing = false;
            this.isConnected = false;
        });
        this.productService.getProducts().subscribe(products => this.products = products);

        
    }

    onBeginPair() {
        this.webSocketService.beginPair();
        this.pairing = true;
    }

    onEndPair() {
        this.webSocketService.endPair();
        this.pairing = false;
    }

    onMessage(ev: MessageEvent) {
        console.log(ev.data);

        var message = JSON.parse(ev.data);

        if (message.commandType === 6) {
            this.devices.push(message.device);
        }
    }

    connectWebSocket() {
        this.webSocketService.connect();

        this.showConnectionStatus = true;
        this.showRetry = false;
        this.connectionStatus = this.connectingString;
    }

}
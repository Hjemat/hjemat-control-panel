import {Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
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
        private routeParams: RouteParams,
        private webSocketService: WebSocketService,
        private dcService: DeviceCustomizationService) {
    }

    device: Device;
    product: Product;
    errorMessage: string;
    deviceCustomization: DeviceCustomization;

    unknownProduct: Product;

    pairButtonText: string = "Begin Pairing";

    pairing: boolean = false;

    ngOnInit() {
        this.webSocketService.webSocket.addEventListener("message", ev => this.onMessage(ev));
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

        if (message.commandType === 2 && message.deviceID === this.device.deviceID) {
            this.device.values[message.valueID] = message.value;
        }
    }

    onConnect() {
        var values = this.product.values;

        var valuesToCheck = values.filter(value => value.readPeriodically === true);
        if (valuesToCheck.length > 0) {
            valuesToCheck.forEach(value => {
                this.webSocketService.requestValue(this.device.deviceID, value.id);
            });
        }
    }

    setupDevice(device: Device) {
        this.device = device;
        this.productService.getProducts()
            .subscribe(
            products => this.onProductsLoaded(products),
            error => this.errorMessage = <any>error)

        this.dcService.getDeviceCustomization(device.deviceID)
            .subscribe(
            dc => this.deviceCustomization = dc,
            error => this.errorMessage = <any>error);




    }

    onProductsLoaded(products: { [id: number]: Product }) {
        this.product = products[this.device.productID];

        if (this.webSocketService.isConnected) {
            this.onConnect();
        }
        
        this.webSocketService.webSocket.addEventListener("open", ev => this.onConnect());
    }

    onToggleClicked(id: number, value: number) {
        this.webSocketService.sendCommand(this.device.deviceID, id, value);
    }

    onRefresh(id: number){
        this.webSocketService.requestValue(this.device.deviceID, id);
    }

    onSetName(name: string) {
        if (!name) { return; }

        var dc: DeviceCustomization = new DeviceCustomization();
        dc.id = this.device.deviceID;
        dc.name = name;

        this.dcService.addDeviceCustomization(dc)
            .subscribe(
            dc => this.deviceCustomization = dc,
            error => this.errorMessage = <any>error);
    }

    goBack() {
        window.history.back();
    }

}
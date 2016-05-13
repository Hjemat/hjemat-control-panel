import {Component } from '@angular/core';
import { OnActivate, Router, RouteSegment} from '@angular/router';
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
    selector: 'my-device-detail',
    templateUrl: 'app/device-detail.component.html',
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
export class DeviceDetailComponent implements OnActivate {
    constructor(
        private deviceService: DeviceService,
        private productService: ProductService,
        private router: Router,
        private webSocketService: WebSocketService,
        private dcService: DeviceCustomizationService) {
    }

    device: Device;
    product: Product;
    errorMessage: string;
    deviceCustomization: DeviceCustomization;

    unknownProduct: Product;

    routerOnActivate(curr: RouteSegment): void {
        this.unknownProduct = new Product();

        this.unknownProduct.name = "Unknown Device";
        this.unknownProduct.description = "An unknown product";

        let id = +curr.getParam('id');
        this.deviceService.getDevice(id)
            .subscribe(
            device => this.setupDevice(device),
            error => this.errorMessage = <any>error);

        this.webSocketService.webSocket.addEventListener("message", ev => this.onMessage(ev));
    }

    onMessage(ev: MessageEvent) {
        console.log(ev.data);

        var message = JSON.parse(ev.data);

        if (message.commandType === 2 && message.deviceID === this.device.deviceID) {
            this.device.values[message.valueID] = message.value;
        }
    }

    refreshValues() {
        if (!this.product) return;

        var values = this.product.values;

        //var valuesToCheck = values.filter(value => value.readPeriodically === true);
        if (values.length > 0) {
            values.forEach(value => {
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
/*
        this.dcService.getDeviceCustomization(device.deviceID)
            .subscribe(
            dc => this.deviceCustomization = dc,
            error => this.errorMessage = <any>error);*/




    }

    onProductsLoaded(products: { [id: number]: Product }) {
        this.product = products[this.device.productID];

        if (this.webSocketService.isOpen()) {
            this.refreshValues();
        }

        this.webSocketService.webSocket.addEventListener("open", ev => this.refreshValues());
    }

    onToggleClicked(id: number, value: number) {
        this.webSocketService.sendCommand(this.device.deviceID, id, value);
    }

    onRefresh(id: number) {
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
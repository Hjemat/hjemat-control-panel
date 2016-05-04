import {Component, OnInit } from '@angular/core';
import { RouteParams } from '@angular/router-deprecated';
import {Device} from './device';
import {Product} from './product';
import { DeviceService } from './device.service';
import { ProductService } from './product.service';

@Component({
    selector: 'my-device-detail',
    templateUrl: 'app/device-detail.component.html',
    styleUrls: ['app/device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit {
    constructor(
        private deviceService: DeviceService,
        private productService: ProductService,
        private routeParams: RouteParams) {
    }

    device: Device;
    product: Product;
    errorMessage: string;

    unknownProduct: Product;

    ngOnInit() {
        this.unknownProduct = new Product();

        this.unknownProduct.name = "Unknown Device";
        this.unknownProduct.description = "An unknown product";

        let id = +this.routeParams.get('id');
        this.deviceService.getDevice(id)
            .subscribe(
            device => this.setupDevice(device),
            error => this.errorMessage = <any>error);


    }

    setupDevice(device: Device) {
        this.device = device;
        this.productService.getProducts()
            .subscribe(
            products => this.product = products[device.productID],
            error => this.errorMessage = <any>error)
    }

    goBack() {
        window.history.back();
    }

}
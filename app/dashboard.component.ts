import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Device } from './device';
import { Product } from './product';
import { DeviceService } from './device.service';
import { ProductService }from './product.service';

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    devices: Device[] = [];
    products: { [id: number]: Product } = {};
    errorMessage: string;
    unknownProduct: Product = new Product();
    constructor(
        private router: Router,
        private deviceService: DeviceService,
        private productService: ProductService) {
    }
    ngOnInit() {
        this.deviceService.getDevices()
            .subscribe(
            devices => this.devices = devices.slice(0, 4),
            error => this.errorMessage = <any>error);

        this.unknownProduct.name = "Unknown Device";
        this.unknownProduct.description = "An unknown product";

        this.getProducts();
    }

    getProducts() {
        this.productService.getProducts()
            .subscribe(
            products => this.products = products,
            error => this.errorMessage = <any>error);
    }

    gotoDetail(device: Device) {
        let link = ['DeviceDetail', { id: device.deviceID }];
        this.router.navigate(link);
    }
}


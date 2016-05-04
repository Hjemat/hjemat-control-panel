import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Device} from './device';
import {DeviceDetailComponent} from './device-detail.component';
import {DeviceService} from './device.service';
import {Product} from './product';
import {ProductService} from './product.service';
import { Router } from '@angular/router-deprecated';

@Component({
  selector: 'my-devices',
  templateUrl: 'app/devices.component.html',
  styleUrls: ['app/devices.component.css'],
  directives: [DeviceDetailComponent]
})
export class DevicesComponent implements OnInit {
  constructor(
    private _deviceService: DeviceService,
    private _productService: ProductService,
    private router: Router) { }

  title = 'Hjemat';
  selectedDevice: Device;
  selectedProduct: Product;
  errorMessage: string;

  unknownProduct: Product = new Product();

  devices: Device[];
  products: { [id: number]: Product };

  ngOnInit() {
    this.getDevices();
    this.getProducts();

    this.unknownProduct.name = "Unknown Device";
    this.unknownProduct.description = "An unknown product";
  }

  getDevices() {
    this._deviceService.getDevices()
      .subscribe(
      devices => this.devices = devices,
      error => this.errorMessage = <any>error);
  }

  getProducts() {
    this._productService.getProducts()
      .subscribe(
      products => this.products = products,
      error => this.errorMessage = <any>error);
  }

  onSelect(device: Device) {
    this.selectedDevice = device;
    if (this.products[device.productID] != null)
      this.selectedProduct = this.products[device.productID];
    else
      this.selectedProduct = this.unknownProduct;
  }

  gotoDetail() {
    let link = ['DeviceDetail', { id: this.selectedDevice.deviceID }];
    this.router.navigate(link);
  }

  test() {
    console.log(this.devices);
  }
}

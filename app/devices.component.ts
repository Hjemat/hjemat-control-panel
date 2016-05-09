import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Device} from './device';
import {DeviceDetailComponent} from './device-detail.component';
import {DeviceService} from './device.service';
import {Product, ProductValue} from './product';
import {ProductService} from './product.service';
import { Router } from '@angular/router-deprecated';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list'
import { MdButton } from '@angular2-material/button'
import { MD_CARD_DIRECTIVES } from '@angular2-material/card'
import { MdSpinner } from '@angular2-material/progress-circle'
import { DeviceCustomization } from './device-customization';
import { DeviceCustomizationService } from './device-customization.service';
import { MyToolbar } from './my-toolbar.component';

@Component({
  selector: 'my-devices',
  templateUrl: 'app/devices.component.html',
  directives: [
    DeviceDetailComponent,
    MD_LIST_DIRECTIVES,
    MdButton,
    MD_CARD_DIRECTIVES,
    MdSpinner,
    MyToolbar]
})
export class DevicesComponent implements OnInit {
  constructor(
    private _deviceService: DeviceService,
    private _productService: ProductService,
    private router: Router,
    private dcService: DeviceCustomizationService) { }

  title = 'Hjemat';
  selectedDevice: Device;
  selectedProduct: Product;
  errorMessage: string;

  unknownProduct: Product = new Product();

  deviceCustomizations: { [id: number]: DeviceCustomization};

  devices: Device[];

  loaded: Boolean = false;  

  primaryValues: { [deviceID: number]: ProductValue } = {};
  primaryValueTexts: { [deviceID: number]: string } = {};

  products: { [id: number]: Product };

  ngOnInit() {
    this.loaded = false;

    this.getDevices();

    //this.router.hostComponent

    this.unknownProduct.name = "Unknown Device";
    this.unknownProduct.description = "An unknown product";
  }

  getDevices() {
    this._deviceService.getDevices()
      .subscribe(
      devices => { this.getProducts(); this.devices = devices },
      error => this.errorMessage = <any>error);
  }

  getProducts() {
    this._productService.getProducts()
      .subscribe(
      products => { this.products = products; this.onProductsLoaded() },
      error => this.errorMessage = <any>error);

    this.dcService.getDeviceCustomizations()
            .subscribe(
            dcs => this.deviceCustomizations = dcs,
            error => this.errorMessage = <any>error);
  }

  onProductsLoaded() {
    this.devices.forEach(device => {
      var product = this.products[device.productID];

      console.log(product);

      if (product) {
        var primaryValue = product.values.find(value => value.primary === true);
        console.log(primaryValue);
        console.log(product.values[0].primary);

        if (primaryValue) {
          this.primaryValues[device.productID] = primaryValue;

          if (!primaryValue.type || primaryValue.type === "number") {
            this.primaryValueTexts[device.deviceID] = device.values[primaryValue.id] + (primaryValue.suffix ||  "");
          }
          else if (primaryValue.type === "bool") {
            if (device.values[primaryValue.id] === 0) {
              this.primaryValueTexts[device.deviceID] = primaryValue.falseLabel ||  "False";
            }
            else {
              this.primaryValueTexts[device.deviceID] = primaryValue.trueLabel ||  "True";
            }
            
            
          }
            
        }
      }
      
    });

    this.loaded = true;
  }

  onSelect(device: Device) {
    this.selectedDevice = device;
    if (this.products[device.productID] != null)
      this.selectedProduct = this.products[device.productID];
    else
      this.selectedProduct = this.unknownProduct;
  }

  gotoSelectedDetail() {
    let link = ['DeviceDetail', { id: this.selectedDevice.deviceID }];
    this.router.navigate(link);
  }

  gotoDetail(device: Device) {
    let link = ['DeviceDetail', { id: device.deviceID }];
    this.router.navigate(link);
  }

  test() {
    console.log(this.devices);
  }
}

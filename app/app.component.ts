import { Component, OnInit }       from '@angular/core';
import { HTTP_PROVIDERS }    from '@angular/http';
import { Router, Routes, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router';

// Services
import { DeviceService }     from './device.service';
import { ProductService } from './product.service';
import {WebSocketService} from './websocket.service';
import { DeviceCustomizationService } from './device-customization.service';

// Components
import { DevicesComponent } from './devices.component';
import { DashboardComponent } from './dashboard.component';
import { DeviceDetailComponent } from './device-detail.component';
import { DevicePairComponent } from './device-pair.component';

// Material Design
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdButton } from '@angular2-material/button';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdSpinner } from '@angular2-material/progress-circle';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';


@Routes([
    { path: '/devices',    component: DevicesComponent },
    { path: '/dashboard',  component: DashboardComponent },
    { path: '/detail/:id', component: DeviceDetailComponent },
    { path: '/pair',       component: DevicePairComponent },
    { path: '*',           component: DevicesComponent}
])

@Component({
    selector: 'my-app',
    templateUrl: 'app/app.component.html',
    styleUrls: ['app/app.component.css'],
    directives: [
        ROUTER_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MdButton,
        MdToolbar,
        MdSpinner,
        MD_SIDENAV_DIRECTIVES,
        MdIcon],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        DeviceService,
        ProductService,
        WebSocketService,
        DeviceCustomizationService,
        MdIconRegistry]
})
export class AppComponent {
    constructor(private _router: Router) { }

    title = 'Hjemat Control Panel';
    public showBack: Boolean = true;

    gotoDevices() {
        this._router.navigate(["Devices"]);
    }
}

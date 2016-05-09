import { Component, OnInit }       from '@angular/core';
import { HTTP_PROVIDERS }    from '@angular/http';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

// Services
import { DeviceService }     from './device.service';
import { ProductService } from './product.service';
import {WebSocketService} from './websocket.service';
import { DeviceCustomizationService } from './device-customization.service';

// Components
import { DevicesComponent } from './devices.component';
import { DashboardComponent } from './dashboard.component';
import { DeviceDetailComponent } from './device-detail.component';

// Material Design
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdButton } from '@angular2-material/button';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdSpinner } from '@angular2-material/progress-circle';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

@RouteConfig([
    {
        path: '/devices',
        name: 'Devices',
        component: DevicesComponent,
        useAsDefault: true
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent
    },
    {
        path: '/detail/:id',
        name: 'DeviceDetail',
        component: DeviceDetailComponent
    },
])

@Component({
    selector: 'my-app',
    template: `
    <md-toolbar>
        <button *ngIf="showBack" md-icon-button (click)="gotoDevices()"><md-icon>arrow_back</md-icon></button>
        <span>{{title}}</span>
    </md-toolbar>
    <div class="content">
        <router-outlet>
        </router-outlet>
    </div>
  `,
    directives: [
        ROUTER_DIRECTIVES,
        MD_LIST_DIRECTIVES,
        MdButton,
        MdToolbar,
        MdSpinner,
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

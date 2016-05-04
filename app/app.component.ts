import { Component }       from '@angular/core';
import { HTTP_PROVIDERS }    from '@angular/http';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

// Services
import { DeviceService }     from './device.service';
import { ProductService } from './product.service';

// Components
import { DevicesComponent } from './devices.component';
import { DashboardComponent } from './dashboard.component';
import { DeviceDetailComponent } from './device-detail.component';

@RouteConfig([
    {
        path: '/devices',
        name: 'Devices',
        component: DevicesComponent
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardComponent,
        useAsDefault: true
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
    <h1>{{title}}</h1>
    <nav>
        <a [routerLink]="['Dashboard']">Dashboard</a>
        <a [routerLink]="['Devices']">Devices</a>
    </nav>
    <router-outlet></router-outlet>
  `,
    styleUrls: ['app/app.component.css'],
    directives: [ROUTER_DIRECTIVES],
    providers: [
        ROUTER_PROVIDERS,
        HTTP_PROVIDERS,
        DeviceService,
        ProductService]
})
export class AppComponent {
    title = 'Hjemat Control Panel';
}

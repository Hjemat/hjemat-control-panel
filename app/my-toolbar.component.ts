import { Component, Input }       from '@angular/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from '@angular/router-deprecated';

// Material Design
import { MdButton } from '@angular2-material/button';
import { MdToolbar } from '@angular2-material/toolbar';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';

@Component({
    selector: 'my-toolbar',
    template: `
    <md-toolbar>
        <button *ngIf="showBack" md-icon-button (click)="gotoDevices()"><md-icon>arrow_back</md-icon></button>
        <span>{{title}}</span>
    </md-toolbar>
  `,
    directives: [
        MdButton,
        MdToolbar,
        MdIcon],
    providers: [
        MdIconRegistry]
})

export class MyToolbar {
    constructor(
        private _router: Router) { }
    public showBack: Boolean = true;

    gotoDevices() {
        this._router.navigate(['Devices']);
        console.log(this._router.hostComponent.AppComponent);
    }
}
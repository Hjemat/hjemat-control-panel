import { Injectable }     from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { DeviceCustomization }           from './device-customization';
import { Observable }     from 'rxjs/Observable';
@Injectable()
export class DeviceCustomizationService {
    constructor(private http: Http) { }
    private dcUrl = 'http://10.130.145.165/api/device_customs/';  // URL to web api
    getDeviceCustomizations(): Observable<{ [id: number]: DeviceCustomization }> {
        return this.http.get(this.dcUrl)
            .map(this.extractListData)
            .catch(this.handleError);
    }
    getDeviceCustomization(id: number) {
        return this.http.get(this.dcUrl + id)
            .map(this.extractData)
            .catch(this.handleError);
    }
    addDeviceCustomization(dc: DeviceCustomization)/*: Observable<DeviceCustomization>*/ {

        let body = JSON.stringify({ "id": dc.id, "name": dc.name });
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        console.log(body);

        return this.http.post(this.dcUrl, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();

        return body || {};
    }

    private extractListData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();

        var dcs: { [id: number]: DeviceCustomization } = {};

        body.forEach(dc => {
            dcs[dc.id] = dc;
        });

        return dcs || {};
    }
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
}

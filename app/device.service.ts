import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Device}           from './device';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class DeviceService {
    constructor(private http: Http) { }
    private _devicesUrl = 'http://10.130.145.165//api/devices/';  // URL to web api
    getDevices(): Observable<Device[]> {
        return this.http.get(this._devicesUrl)
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
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    getDevice(id: number) {
        return this.http.get(this._devicesUrl + id)
            .map(this.extractData)
            .catch(this.handleError);
    }
}

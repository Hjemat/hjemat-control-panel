import {Injectable}     from '@angular/core';
import {Http, Response} from '@angular/http';
import {Product}           from './product';
import {Observable}     from 'rxjs/Observable';

@Injectable()
export class ProductService {
    constructor(private http: Http) { }
    private _productsUrl = 'app/products.json';  // URL to web api
    getProducts(): Observable<{ [id: number]: Product }> {
        return this.http.get(this._productsUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        

        var products: { [id: number]: Product } = {};    

        body.forEach(product => {
            products[product.id] = product;
        });

        console.log(products);
        return products || {};
    }
    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }
    getProduct(id: number) {
        return this.http.get(this._productsUrl)
            .map(this.extractData)
            .catch(this.handleError)[id];
    }
}

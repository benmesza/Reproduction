import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

    constructor(private _loadingCtrl: LoadingController) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._loadingCtrl.getTop().then(hasLoading => {
            if (!hasLoading) {
                this._loadingCtrl.create({
                    spinner: 'circular',
                    translucent: true
                }).then(loading => loading.present());
            }
        });
        return next.handle(request).pipe(finalize(() => {
            this._loadingCtrl.getTop().then(hasLoading => {
                if (hasLoading) {
                    this._loadingCtrl.dismiss();
                }
            });
        }));
    }
}

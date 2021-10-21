import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {

    constructor(
        private _storage: Storage
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return from(this._storage.get('access_token'))
            .pipe(
                switchMap((token: any) => {
                    let clonedRequest;
                    if (token) {
                        clonedRequest = req.clone({
                            headers: req.headers.set('Authorization', `Bearer ${token}`)
                        });
                    }
                    return next.handle(clonedRequest);
                })
            );
    }
}

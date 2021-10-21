import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getSubdomain } from '../common/utils/domain';

@Injectable()
export class SubdomainInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!request.headers.has('X-Subdomain')) {
          request = request.clone({
            setHeaders: {
              'X-Subdomain': getSubdomain()
            }
          });
        }
        return next.handle(request);
    }
}

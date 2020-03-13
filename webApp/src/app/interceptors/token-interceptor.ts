import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(public auth: AuthenticationService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        var token = this.auth.getToken();
        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
            // request = request.clone({ headers: request.headers.set('Authorization', 'Bearer cf0fe471-b7d7-49e0-9a03-88aaba8a2c44')});
        }

        if (!request.headers.has('Content-Type')) {
            request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (event.status === 401) {
                        this.auth.redirectAuth();
                    }
                    console.log('event--->>>', event);
                }
                return event;
            }));

        // request = request.clone({
        //     setHeaders: {
        //         Authorization: `Bearer ${this.auth.getToken()}`
        //     }
        // });
        // return next.handle(request).pipe(
        //     tap(err => {
        //         if (err instanceof HttpErrorResponse) {
        //             if (err.status === 401) {
        //                 this.auth.redirectAuth();
        //             }
        //             //       }
        //         }
        //     }, error => {
        //         console.error('NICE ERROR', error)
        //     })
        // )
        // //     return next.handle(request).do((event: HttpEvent<any>) => {
        // //     }, (err: any) => {
        // //       if (err instanceof HttpErrorResponse) {
        // //         if (err.status === 401) {
        // //           this.auth.redirectAuth();
        // //         }
        // //       }
        // //     });
        // //   }
    }
}
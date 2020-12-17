import { JsonPipe } from '@angular/common';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService, 
    private userStateService: UserStateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders()
    req; 
    if ('blob' === req.responseType) {
      return next.handle(req)
    }
    if (this.userStateService.isLoggedIn === true) {
      req = req.clone({
        setHeaders: {
          'Authorization':`Token ${this.authService.getToken()}`
        }
      });
    }

    return next.handle(req);
  }
}
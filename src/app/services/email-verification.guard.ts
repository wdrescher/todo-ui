import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private _authService: AuthService, 
    private _router: Router, 
    private _cookieService: CookieService, 
    private _userStateService: UserStateService
  ){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let emailToken = next.params["token"]; 
    return this._authService.validateEmail(emailToken).pipe(
      take(1), 
      map(
        (response) => { 
          if (!response) {
            this._router.navigateByUrl("verify-email")
            return true;
          }         
          let token = response.token; 
          this._cookieService.set("token", token)
          this._userStateService.isLoggedIn = true;
          this._router.navigateByUrl("network")
          return true;
        }, 
        () => {
          this._router.navigateByUrl("login")
          return true;
        }
      )
    )
  }
  
}

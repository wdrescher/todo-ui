import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class SignoutGuard implements CanActivate {
  constructor(
    private cookieService: CookieService,
    private userStateService: UserStateService, 
    private router: Router, 
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.userStateService.isLoggedIn) {
      this.cookieService.delete("token"); 
      this.userStateService.isLoggedIn = false; 
      this.router.navigateByUrl('')
    }
    return true; 
  }
  
}

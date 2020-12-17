import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class MustBeLoggedInGuard implements CanActivate {
  constructor(
    private userStateService: UserStateService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const nextUrl = !!state.url ? encodeURI(state.url.toString().slice(1)) : undefined; 
      return this.userStateService.isLoggedIn 
        ? true
        : this.router.navigateByUrl(`login${!!nextUrl ? "/" + nextUrl : '' }`); 
  }
}

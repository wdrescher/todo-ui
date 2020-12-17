import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators'; 

import { AuthService } from './auth.service';
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private userStateService: UserStateService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      this.userStateService.isLoggedIn = true
      return this.authService.getUserInfo().pipe(
        take(1),
        map(
          () => {
            return true; 
          },
          () => {
            return false;
          }
        )
      )
  } 
}

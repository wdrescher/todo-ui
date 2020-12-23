import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { CookieService } from 'ngx-cookie-service';
import { take } from 'rxjs/operators';

import { AuthService } from './services/auth.service';
import { UserStateService } from './services/user-state.service';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'founder-base';
  isLoading = false;
  isLoggedIn = false; 
  url = ""; 

  constructor(
    private router: Router, 
    private _socialAuthService: SocialAuthService, 
    private userStateService: UserStateService, 
    private authService: AuthService, 
    private cookieService: CookieService, 
  ){}
  
  ngOnInit(): void {
    this._socialAuthService.authState
    .subscribe(
      user => {
        if (user != null && !this.userStateService.isLoggedIn) {
          let token = user.authToken;
          let data = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
          this.isLoading = true;
          this.authService.tokenSwap(token, data)
            .pipe(take(1))
            .subscribe(
              response => {
                this.cookieService.set("token", response.auth_token)
                this.userStateService.isLoggedIn = true;
                this.isLoading = false
              },
              () => {
              }
            )
        }
      }
    )

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading = true;
          window.scrollTo({top: 0});
          break;
        }
        case event instanceof NavigationEnd:
          this.url = ((event as NavigationEnd).url)
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // let cc = window as any;
    // cc.cookieconsent.initialise({
    //   palette: {
    //     popup: {
    //       background: "#196aff"
    //     },
    //     button: {
    //       background: "#1A202C",
    //       text: "#FFFFFF"
    //     }
    //   },
    //   position: "bottom-left",
    //   content: {
    //     message: "This website uses cookies to deliver the best user experience",
    //     dismiss: "Agree",
    //     link: "Learn more",
    //     href: "/privacy-policy" 
    //   }
    // });
  }
}

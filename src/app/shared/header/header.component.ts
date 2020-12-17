import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SocialAuthService } from "angularx-social-login";
import { ROUTES } from 'src/app/app.constants';

import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor(
    private _router: Router, 
    private userStateService: UserStateService
  ) { }

  ngOnInit(): void {}

  goToSignup(): void {
    this._router.navigateByUrl(ROUTES.signup); 
  }

  get isLoggedIn(): boolean {
    return this.userStateService.isLoggedIn; 
  }

  signout(): void {
    this._router.navigateByUrl(ROUTES.signout)
  }
}

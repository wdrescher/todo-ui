import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

import { TokenResponse } from '../services/auth.interface';  
import { AuthService } from '../services/auth.service';
import { UserStateService } from '../services/user-state.service';
import { ROUTES } from 'src/app/app.constants'; 

enum LoginPageState {
  Login = "login", 
  Signup = "signup", 
  ForgotPassword = "forgotPassword", 
  ResetPassword = "resetPassword"
}

@Component({
  selector: 'login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  formGroup: FormGroup; 
  loginError = ''; 
  isLoading = false; 
  token = ''; 
  passwordResetMessage: string;
  private _pageSettings: {[label: string]: any} = {
    login: {
      color: "blue", 
      title: "Login",
      buttonText: "Login",
      secondaryButtonText: "Sign up here.", 
      message: "Don't have an account?"
    }, 
    signup: {
      color: "blue",
      title: "Sign Up", 
      buttonText: "Sign Up", 
      secondaryButtonText: "Login here.", 
      message: "Already have an account?"
    }, 
    forgotPassword: {
      color: "blue",
      title: "Forgot Password",
      buttonText: "Reset", 
      secondaryButtonText: "Login here.", 
      message: "Just remembered it?"
    }, 
    resetPassword: {
      color: "blue", 
      title: "Reset Password", 
      buttonText: "Reset", 
      secondaryButtonText: "Login here.", 
      message: "Just remebered it?"
    }
  }
  private _controlNameMapping: {[controlName: string]: string} = {
    username: "Email", 
    password: "Password", 
    confirmPassword: "Matching Password"
  }
  private _pageState = LoginPageState.Login; 
  private _controlNames = [
    'username', 'password', 'confirmPassword'
  ]
  private _token: string;
  private _nextRoute: string; 

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private authService: AuthService,
    private cookieService: CookieService, 
    private router: Router, 
    private userStateService: UserStateService, 
    private socialAuthService: SocialAuthService,
  ) {}

  private _checkToken(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe(
      (response) => {
        if (response.has("token")) {
          this._token = response.get("token");
          this.authService.validateToken(this._token).pipe(take(1)).subscribe(
            () => {
              return
            }, 
            () => {
              // this.modal.open();
              this.router.navigateByUrl("forgot-password")
              this.loginError = "Token expired"
            }
          )
        }
        else if (response.has("route")) {
          this._nextRoute = decodeURI(response.get("route"));
        }
      }, 
      () => {
        // this.modal.open
      }
    )
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      username: ['', Validators.email],
      password: [''], 
      confirmPassword: ['']
    })
    this._checkToken();
    this.activatedRoute.data.subscribe( param => {
      if (param.isSignUp === true){ 
        this.pageState = LoginPageState.Signup; 
      }
      if (param.forgotPassword === true) {
        this.pageState = LoginPageState.ForgotPassword; 
      }
      if (param.resetPassword === true) {
        this.pageState = LoginPageState.ResetPassword; 
      }
    })
  }

  private _login(token: string): void {
    this.cookieService.set("token", token);
    this.router.navigate([!this._nextRoute ? ROUTES.home : this._nextRoute]); 
    this.userStateService.isLoggedIn = true; 
  }

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.isLoading = true; 
      if (this.isLogin) {
        this.loginError = ''; 
        const username = this.formGroup.controls['username'].value; 
        const password = this.formGroup.controls['password'].value; 
        this.authService.attemptLogin(username, password)
        .pipe(take(1))
        .subscribe(
          (response: TokenResponse) => {
            this.isLoading = false; 
            this._login(response.token); 
          }, 
          (response) => {
            this.isLoading = false; 
            this.formGroup.controls['password'].setValue(''); 
            this.formGroup.controls['password'].reset(); 
            if (response.error && response.error && response.error["non_field_errors"]) {
              this.loginError = "That username and password didn't work, please try again"
            }
            else {
              // this.modal.open();
            }
          }
        ); 
      }
      else if (this.isSignup) {
        const controls = this.formGroup.controls;
        this.authService.registerUser(
          controls['username'].value, 
          controls['password'].value
        )
        .pipe(take(1))
        .subscribe(
          (response) => {
            this.isLoading = false; 
            this._login(response.auth_token); 
          }, 
          (response) => {
            if (response.error && response.error.username && response.error.username[0]) {
              this.loginError = response.error.username[0]
            }
            else {
              this.loginError = "whoops something must have gone wrong"
              // this.modal.open(); 
            }
            this.isLoading = false; 
          }
        )
      }
      else if (this.pageState === LoginPageState.ForgotPassword) {
        const email = this.formGroup.controls['username'].value; 
        this.authService.forgotPassword(email)
          .pipe(take(1))
          .subscribe(
            () => {
              this.passwordResetMessage = "Check your email for a password reset link"; 
              this.isLoading = false;
              this._pageSettings[this._pageState].buttonText = "&#x2714;"
            },
            (response) => {
              this.isLoading = false; 
              if (response.errors) {
                this.loginError = "whoops something must have gone wrong"
              }
              // this.modal.open(); 
            }
          )
      }
      else if (this.pageState === LoginPageState.ResetPassword) {
        let password = this.formGroup.controls["password"].value; 
        this.authService.resetPassword(this._token, password)
          .pipe(take(1))
          .subscribe(
            () => {
              this.router.navigateByUrl("login")
            }, 
            (response) => {
              this.isLoading = false;
              if (response.error && response.error.password) {
                this.loginError = response.error.password[0];
              }
              else {
                // this.modal.open(); 
              }
            }
          )
      }
    }
  }

  authWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  toggleState(): void {
    this.isLogin ? this.router.navigateByUrl('signup') : this.router.navigateByUrl('login') 
  }

  forgotPassword(): void {
    this.router.navigateByUrl("forgot-password"); 
  }

  isInvalid(formControlName): boolean {
    const control = this.formGroup.controls[formControlName]; 
    if (formControlName === 'confirmPassword' && (control.dirty || control.touched)) {
      return control.value !== this.formGroup.controls['password'].value; 
    }
    return (control.dirty || control.touched) && control.invalid; 
  }

  get errors(): string {
    for (const controlIndex in this._controlNames) {
      const controlName = this._controlNames[controlIndex];
      const control = this.formGroup.controls[controlName]
      if (control.errors && this.isInvalid(controlName)) {
        if (controlName === 'confirmPassword' && this.formGroup.controls['password'].value !== control.value) {
          return "Passwords do not match"
        }
        else if (controlName === "password" && control.value.length <= 8) {
          return "Enter 8 or more characters"
        }
        return `Please enter a valid ${this._controlNameMapping[controlName]}`
      }
    } 
    return ''; 
  } 



  get isLogin(): boolean {
    return this._pageState == LoginPageState.Login; 
  }

  get isSignup(): boolean {
    return this._pageState === LoginPageState.Signup; 
  }

  get isForgotPassword(): boolean {
    return this._pageState === LoginPageState.ForgotPassword; 
  }

  get isReset(): boolean {
    return this._pageState === LoginPageState.ResetPassword;
  }

  set pageState(state: LoginPageState) {
    this._pageState = state; 
    switch(state) {
      case LoginPageState.Login: 
        this.formGroup.controls['confirmPassword'].clearValidators(); 
        this.formGroup.controls['password'].setValidators(Validators.minLength(8)); 
        break; 
      case LoginPageState.Signup: 
        this.formGroup.controls['confirmPassword'].setValidators(Validators.required);
        this.formGroup.controls['password'].setValidators(Validators.minLength(8)); 
        break; 
      case LoginPageState.ResetPassword: 
        this.formGroup.controls['confirmPassword'].setValidators(Validators.required);
        this.formGroup.controls['password'].setValidators(Validators.minLength(8)); 
        return;
      default: 
        return; 
    }
  }

  get pageState(): LoginPageState {
    return this._pageState; 
  }

  get config() {
    return this._pageSettings[this.pageState]; 
  }
}

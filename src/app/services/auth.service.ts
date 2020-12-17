import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

import { API_URL } from '../app.constants'; 
import { UserStateService } from './user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService, 
  ) { }

  attemptLogin(username: string, password: string): Observable<any>{
    this.cookieService.delete("token")
    const body = {
      username: username, 
      password: password
    }
    return this.http.post(`${API_URL}/api-token-auth/`, body); 
  }

  registerUser(username: string, password: string, firstName: string, lastName: string): Observable<any> {
    const body = {
      username: username, 
      password: password, 
      first_name: firstName, 
      last_name: lastName, 
      email: username
    }
    return this.http.post(`${API_URL}/api/v1/users/`, body); 
  }

  getUserInfo(): Observable<any> {
    return this.http.get(`${API_URL}/profile/`, {headers: {'Authorization': ""}})
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  forgotPassword(email: string): Observable<any> {
    let data = {
      email: email
    }
    return this.http.post(`${API_URL}/reset/`, data); 
  }

  resetPassword(token: string, password: string): Observable<any>{
    let data = {
      token: token, 
      password: password
    }
    return this.http.post(`${API_URL}/reset/confirm/`, data)
  }

  validateToken(token: string): Observable<any> {
    let data = {
      token: token
    }
    return this.http.post(`${API_URL}/reset/validate_token/`, data)
  }

  validateEmail(token: string): Observable<any> {
    let data = {
      token: token
    }; 
    return this.http.post(`${API_URL}/verify-email/`, data)
  }

  resendEmail() {
    return this.http.get(`${API_URL}/resend-email/`)
  }

  tokenSwap(token: string, userSetup: any): Observable<any> {
    let data = {
      token: token, 
    }
    if (!!userSetup) {
      data['userSetup'] = userSetup;
    }
    return this.http.post(`${API_URL}/social/google-oauth2/`, data); 
  }
}
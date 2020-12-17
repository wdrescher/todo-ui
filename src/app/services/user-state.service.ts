import { Injectable } from '@angular/core';

import { Profile } from 'src/app/app.interface'; 

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  isLoggedIn: boolean = false;
  profile: Profile; 

  constructor() {}
}

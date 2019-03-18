// import { Platform } from '@ionic/angular';
// import { Injectable } from '@angular/core';
// import { Storage } from '@ionic/storage';
// import { BehaviorSubject } from 'rxjs';
 
// const TOKEN_KEY = 'auth-token';
 
// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
 
//   authenticationState = new BehaviorSubject(false);
 
//   constructor(private storage: Storage, private plt: Platform) { 
//     this.plt.ready().then(() => {
//       this.checkToken();
//     });
//   }
 
//   checkToken() {
//     this.storage.get(TOKEN_KEY).then(res => {
//       if (res) {
//         this.authenticationState.next(true);
//       }
//     })
//   }
 
//   login(values) {
//     return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
//       this.authenticationState.next(true);
//     });
//   }
 
//   logout() {
//     return this.storage.remove(TOKEN_KEY).then(() => {
//       this.authenticationState.next(false);
//     });
//   }
 
//   isAuthenticated() {
//     return this.authenticationState.value;
//   }
 
// }

import { Injectable, Inject } from '@angular/core';

// import { ConfigService } from '../config.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
@Injectable()
export class AuthenticationService {
  aacClientId;
  redirectUrl;
  scope;
  aacUrl;
  constructor(    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig,
    private http: HttpClient) {
      this.aacClientId=config.aacClientId;
      this.redirectUrl=config.redirectUrl;
      this.scope=config.scope;
      this.aacUrl=config.aacUrl;
     }

  /**
   * Check status of the login. Return true if the user is already logged or the token present in storage is valid
   */
  checkLoginStatus(): Promise<boolean> {
    const token = sessionStorage.getItem('access_token');
    const expiresIn = sessionStorage.getItem('access_token_expires_in') || 0;
    return Promise.resolve(!!token && expiresIn > new Date().getTime());
  }

  redirectAuth() {
    // tslint:disable-next-line:max-line-length
    window.location.href = `${this.aacUrl}/eauth/authorize?response_type=token&client_id=${this.aacClientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`;
  }

  logout() {
    sessionStorage.clear();
    const redirect = `${this.aacUrl}/logout?target=${window.location.href}`;
    window.location.href = redirect;
  }
  getToken() {
    return sessionStorage.getItem('access_token');
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.aacUrl}/basicprofile/me`);
  }
}
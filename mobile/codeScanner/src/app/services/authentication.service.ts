import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
import { Router } from '@angular/router';

var LOGIN_TYPE = {
  AAC: 'oauth',
  CUSTOM: 'custom',
  COOKIE: 'cookie'
};

// 'googlelocal' and 'facebooklocal' used locally
var PROVIDER = {
  INTERNAL: 'internal',
  GOOGLE: 'google',
  FACEBOOK: 'facebook'
};
var settings = {
  loginType: undefined,
  googleWebClientId: "825214541940-36genh37bu7d5qgm03imlg9hktarmsvm.apps.googleusercontent.com",
  aacUrl: "https://am-dev.smartcommunitylab.it/aac",
  clientId: "2be89b9c-4050-4e7e-9042-c02b0d9121c6",
  clientSecret: "7deb5fab-b9f6-4363-b6ca-3acccabdce81",
  customConfig: undefined
};
var PROVIDER_NATIVE = {
  GOOGLE: 'googlelocal',
  FACEBOOK: 'facebooklocal'
};
var authWindow = null;

var AAC = {
  AUTHORIZE_URI: "/eauth/authorize",
  SUCCESS_REGEX: /\?code=(.+)$/,
  ERROR_REGEX: /\?error=(.+)$/,
  BASIC_PROFILE_URI: "/basicprofile/me",
  ACCOUNT_PROFILE_URI: "/accountprofile/me",
  TOKEN_URI: "/oauth/token",
  REGISTER_URI: "/internal/register/rest",
  RESET_URI: "/internal/reset",
  REVOKE_URI: "/eauth/revoke/",
  REDIRECT_URL: "http://localhost"
};
@Injectable()
export class AuthenticationService {
  // aacClientId;
  // redirectUrl;
  // scope;
  // aacUrl;
  constructor(@Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig,
    private http: HttpClient,
    private router: Router) {
    // this.aacClientId=config.aacClientId;
    // this.redirectUrl=config.redirectUrl;
    // this.scope=config.scope;
    // this.aacUrl=config.aacUrl;
  }

  /**
   * Check status of the login. Return true if the user is already logged or the token present in storage is valid
   */
  checkLoginStatus(): Promise<boolean> {
    console.log("checklogin")
    var user = JSON.parse(window.localStorage.getItem('google_user'))

    const token = user.accessToken;
    console.log(token)

    const expiresIn = user.expires || 0;
    console.log(expiresIn)
    console.log(!!token && expiresIn > new Date().getTime())

    return Promise.resolve(!!token && (expiresIn * 1000) > new Date().getTime());
  }


  redirectAuth() {
    window.localStorage.clear();
    this.router.navigate(['login']);
    // tslint:disable-next-line:max-line-length
    // window.location.href = `${this.aacUrl}/eauth/authorize?response_type=token&client_id=${this.aacClientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`;
  }

  logout() {
    window.localStorage.clear();
    this.router.navigate(['login']);
    // sessionStorage.clear();
    // const redirect = `${this.aacUrl}/logout?target=${window.location.href}`;
    // window.location.href = redirect;
  }
  getToken() {
    console.log('gettoken');

    var user = JSON.parse(window.localStorage.getItem('google_user'))
    console.log(user);

    if (user) {
      const token = user.accessToken;
      return token;
    }
    return null;
  }


  authorizeProvider(token): Promise<any> {
   
    return  new Promise((resolve, reject) => {

      var processThat = false;

      var authUrl;
      // Build the OAuth consent page URL
      authUrl = settings.aacUrl + AAC.AUTHORIZE_URI + '/' + PROVIDER_NATIVE.GOOGLE;;
      authUrl += '?client_id=' + settings.clientId + '&response_type=code' + '&redirect_uri=' + AAC.REDIRECT_URL;
      if (token) {
        authUrl += '&token=' + token;
      }
  
  
      // Open the OAuth consent page in the InAppBrowser
      if (!authWindow) {
        authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');
        processThat = !!authWindow;
      }
  
      var processURL = function (url, w): Promise<any> {
        var success, error;
  
        if (settings.loginType == LOGIN_TYPE.AAC) {
          success = AAC.SUCCESS_REGEX.exec(url);
          error = AAC.ERROR_REGEX.exec(url);
        } else if (settings.loginType == LOGIN_TYPE.COOKIE) {
          // TODO cookie
          success = settings.customConfig.SUCCESS_REGEX.exec(url);
          error = settings.customConfig.ERROR_REGEX.exec(url);
        }
  
        if (w && (success || error)) {
          // Always close the browser when match is found
          w.close();
          authWindow = null;
        }
  
        if (success) {
          if (settings.loginType == LOGIN_TYPE.AAC) {
            var code = success[1];
            if (code.substring(code.length - 1) == '#') {
              code = code.substring(0, code.length - 1);
            }
            console.log('[LOGIN] AAC code obtained');
            return Promise.resolve(code);
          } else if (settings.loginType == LOGIN_TYPE.COOKIE) {
            // TODO cookie
            var str = success[1];
            if (str.indexOf('#') != -1) {
              str = str.substring(0, str.indexOf('#'));
            }
            var profile = JSON.parse(decodeURIComponent(str));
            console.log('[LOGIN] profile obtained');
            return Promise.resolve(profile);
          }
        } else if (error) {
          //The user denied access to the app
          return Promise.reject({
            error: error[1]
          });
        }
      };
  
      if (processThat) {
        authWindow.addEventListener('loadstart', function (e) {
          //console.log('[LOGIN] ' + e);
          var url = e.url;
          return processURL(url, authWindow);
        });
      }
    });
  };

  getAACtoken(code): Promise<any> {
    console.log('getAACToken');

    var url = "https://am-dev.smartcommunitylab.it/aac/oauth/token";

    return this.http.post(url, null, {
      params: {
        'client_id': "2be89b9c-4050-4e7e-9042-c02b0d9121c6",
        'client_secret': "7deb5fab-b9f6-4363-b6ca-3acccabdce81",
        'code': code,
        'redirect_uri': "http://localhost",
        'grant_type': 'authorization_code'
      }
    }).toPromise().then(response => {
      if (!!response["data"]["access_token"]) {
        console.log('[LOGIN] AAC token obtained');
        return Promise.resolve(response["data"]);
      } else {
        return Promise.resolve(null);
      }
    }
    );
  };

  // getProfile(): Observable<any> {
  //   return this.http.get(`${this.aacUrl}/basicprofile/me`);
  // }
}

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

// import { Injectable, Inject } from '@angular/core';

// // import { ConfigService } from '../config.service';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';

// @Injectable()
// export class AuthenticationService {
//   aacClientId;
//   redirectUrl;
//   scope;
//   aacUrl;
//   settings = {
// 		loginType: undefined,
// 		googleWebClientId: undefined,
// 		aacUrl: undefined,
// 		clientId: undefined,
// 		clientSecret: undefined,
// 		customConfig: undefined
// 	};
//   constructor(    @Inject(APP_CONFIG_TOKEN) private config: ApplicationConfig,
//     private http: HttpClient) {
//       this.aacClientId=config.aacClientId;
//       this.redirectUrl=config.redirectUrl;
//       this.scope=config.scope;
//       this.aacUrl=config.aacUrl;
//      }

//   /**
//    * Check status of the login. Return true if the user is already logged or the token present in storage is valid
//    */
//   checkLoginStatus(): Promise<boolean> {
//     const token = sessionStorage.getItem('access_token');
//     const expiresIn = sessionStorage.getItem('access_token_expires_in') || 0;
//     return Promise.resolve(!!token && expiresIn > new Date().getTime());
//   }

//   redirectAuth() {
//     // tslint:disable-next-line:max-line-length
//     window.location.href = `${this.aacUrl}/eauth/authorize?response_type=token&client_id=${this.aacClientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`;
//   }

//   logout() {
//     sessionStorage.clear();
//     const redirect = `${this.aacUrl}/logout?target=${window.location.href}`;
//     window.location.href = redirect;
//   }
//   getToken() {
//     return sessionStorage.getItem('access_token');
//   }

//   getProfile(): Observable<any> {
//     return this.http.get(`${this.aacUrl}/basicprofile/me`);
//   }


//   /*
// 	 * get token using the authorization code
// 	 */

// 	getAACtoken(code):Promise<any> {

//     var url =  "https://am-dev.smartcommunitylab.it/aac/oauth/token";

// 		return this.http.post(url, null, {
// 			params: {
// 				'client_id': "2be89b9c-4050-4e7e-9042-c02b0d9121c6",
// 				'client_secret': " 7deb5fab-b9f6-4363-b6ca-3acccabdce81",
// 				'code': code,
// 				'redirect_uri': "localhost",
// 				'grant_type': 'authorization_code'
// 			}
// 		}).toPromise().then(response => {
// 				if (!!response.data.access_token) {
// 					console.log('[LOGIN] AAC token obtained');
// 					return Promise.resolve(response.data);
// 				} else {
// 					return Promise.resolve(null);
// 				}
// 			}
// 		);
// 	};
//  }
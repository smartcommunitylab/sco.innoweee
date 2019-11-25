import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { APP_CONFIG_TOKEN, ApplicationConfig } from '../app-config';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { resolve } from 'q';

var LOGIN_TYPE = {
  AAC: 'oauth',
  CUSTOM: 'custom',
  COOKIE: 'cookie'
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

  PROVIDER_VAR='user_provider'
  PROFILE_VAR= 'user_profile'
  TOKENINFO_VAR= 'user_tokenInfo'
  PROVIDER = {
    INTERNAL: 'internal',
    GOOGLE: 'google',
    FACEBOOK: 'facebook'
  };
  LOGIN_TYPE = {
    AAC: 'oauth',
    CUSTOM: 'custom',
    COOKIE: 'cookie'
  };
  config = {
    webClientId: '',
    clientId: '',
    clientSecKey: '',
    AACURL: ''
  };
  settings = {
    loginType: LOGIN_TYPE.AAC,
    aacUrl: "https://am-dev.smartcommunitylab.it/aac",
    clientId: "",
    clientSecret: "",
    customConfig: undefined
  };
  user = {
    provider: null,
    profile: null,
    tokenInfo: null
  };

  userLocalStorage = {
		PROVIDER: 'user_provider',
		PROFILE: 'user_profile',
		TOKENINFO: 'user_tokenInfo',
		getProvider:  ()=> {
			return JSON.parse(localStorage.getItem(this.userLocalStorage.PROVIDER));
		},
		saveProvider:  ()=> {
			localStorage.setItem(this.userLocalStorage.PROVIDER, JSON.stringify(this.user.provider));
		},
		getProfile:  ()=>{
			return JSON.parse(localStorage.getItem(this.userLocalStorage.PROFILE));
		},
		saveProfile:  ()=> {
			localStorage.setItem(this.userLocalStorage.PROFILE, JSON.stringify(this.user.profile));
		},
		getTokenInfo:  ()=> {
			return JSON.parse(localStorage.getItem(this.userLocalStorage.TOKENINFO));
		},
		saveTokenInfo:  ()=>{
			localStorage.setItem(this.userLocalStorage.TOKENINFO, JSON.stringify(this.user.tokenInfo));
		},
		getUser:  () => {
			this.user = {
				provider: this.userLocalStorage.getProvider(),
				profile: this.userLocalStorage.getProfile(),
				tokenInfo: this.userLocalStorage.getTokenInfo()
			};
            return this.user;
		},
		saveUser: function () {
			this.saveProvider();
			this.saveProfile();
			this.saveTokenInfo();
		},
		deleteUser: function () {
			localStorage.removeItem(this.PROVIDER);
			localStorage.removeItem(this.PROFILE);
			localStorage.removeItem(this.TOKENINFO);
		}
	};

	userIsLogged = function () {
		return (!!this.user && !!this.user.provider && !!this.user.profile && !!this.user.profile.userId && (this.settings.loginType == this.service.LOGIN_TYPE.COOKIE ? true : !!this.user.tokenInfo));
	};
  libConfigOK;
  jsonURL = './assets/data/auth.json';

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private router: Router) {
      this.getJSON().subscribe(data => {
        console.log(data);
        this.settings.clientId=data.clientId;
        this.settings.clientSecret=data.clientSecret;
      })
    // this.aacClientId=config.aacClientId;
    // this.redirectUrl=config.redirectUrl;
    // this.scope=config.scope;
    // this.aacUrl=config.aacUrl;
  }
  public getJSON(): Observable<any> {
    return this.http.get(this.jsonURL);
  }
  init() {
    return new Promise((resolve, reject) => {
      if (!this.settings) {
        this.libConfigOK = false;
        return;
        reject('Invalid settings');
      } else {
        var validLoginType = false;
        for (var key in this.LOGIN_TYPE) {
          if (validLoginType == false && this.settings.loginType == this.LOGIN_TYPE[key]) {
            validLoginType = true;
          }
        }

        if (!validLoginType) {
          this.libConfigOK = false;
          reject('Invalid login type');
        } else {
          if (this.settings.loginType == this.LOGIN_TYPE.AAC && (!this.settings.aacUrl || !this.settings.clientId || !this.settings.clientSecret)) {
            this.libConfigOK = false;
            reject('AAC URL, clientId and clientSecret needed');
          } else if (this.settings.loginType == this.LOGIN_TYPE.COOKIE && (!this.settings.customConfig || !this.settings.customConfig.AUTHORIZE_URL || !this.settings.customConfig.SUCCESS_REGEX || !this.settings.customConfig.ERROR_REGEX || !this.settings.customConfig.REVOKE_URL || !this.settings.customConfig.REDIRECT_URL)) {
            this.libConfigOK = false;
            reject('Complete custom config needed');
          }
        }
      }

      if (this.libConfigOK != false) {
        // undefined or true
        // settings = newSettings;
        this.libConfigOK = true;
        this.userLocalStorage.getUser();
        resolve();
      }
    })

  }
  setUser() {
    this.user  = {
      provider: this.getProvider(),
      profile: this.getProfile(),
      tokenInfo: this.getTokenInfo()
    };
  }
  getProvider() {
    return JSON.parse(localStorage.getItem(this.PROVIDER_VAR));
  }
  getProfile() {
    return JSON.parse(localStorage.getItem(this.PROFILE_VAR));
  }
  getTokenInfo() {
    return JSON.parse(localStorage.getItem(this.TOKENINFO_VAR));
  }
  deleteUser() {
    localStorage.removeItem(this.PROVIDER_VAR);
    localStorage.removeItem(this.PROFILE_VAR);
    localStorage.removeItem(this.TOKENINFO_VAR);
  }
   resetUser() {
		this.user = {
			provider: undefined,
			profile: undefined,
			tokenInfo: undefined
		};
		this.userLocalStorage.deleteUser();
	};
  /*
	 * GET (REFRESHING FIRST IF NEEDED) AAC TOKEN
	 */
  //  refreshTokenDeferred = null;
	 refreshTokenTimestamp = null;
	getValidAACtoken() {
    return new Promise<any>((resolve,reject) =>{
// 10 seconds
// if (!!this.refreshTokenDeferred && ((new Date().getTime()) < (this.refreshTokenTimestamp + (1000 * 10)))) {
//   console.log('[LOGIN] use recent refreshToken deferred!');
//   return this.refreshTokenDeferred.promise;
// }

this.refreshTokenTimestamp = new Date().getTime();
// this.refreshTokenDeferred =  new Promise<any>();

// check for expiry.
var now = new Date();
if (!!this.user && !!this.user.tokenInfo && !!this.user.tokenInfo.refresh_token) {
  var validUntil = new Date(this.user.tokenInfo.validUntil);
  if (validUntil.getTime() >= now.getTime() + (60 * 60 * 1000)) {
    resolve(this.user.tokenInfo.access_token);
  } else {
    this.http.post(this.settings.aacUrl + AAC.TOKEN_URI, null, {
      params: {
        'client_id': this.settings.clientId,
        'client_secret': this.settings.clientSecret,
        'refresh_token': this.user.tokenInfo.refresh_token,
        'grant_type': 'refresh_token'
      }
    }).toPromise().then(
       (response:any) =>{
        if (response.data.access_token) {
          console.log('[LOGIN] AAC token refreshed');
          this.saveToken(response.data);
          this.saveTokenInfo();
          resolve(response.data.access_token);
        } else {
          this.resetUser();
          console.log('[LOGIN] invalid refresh_token');
          reject(null);
        }
      },
       (reason) => {
        this.resetUser();
        reject(reason);
      }
    );
  }
} else {
  this.resetUser();
  reject(null);
}

// return this.refreshTokenDeferred.promise;
    })
		
	};
  /**
   * Check status of the login. Return true if the user is already logged or the token present in storage is valid
   */
  checkLoginStatus(): Promise<boolean> {
    console.log("checklogin")
    var user = JSON.parse(localStorage.getItem('google_user'))

    const token = user.accessToken;
    console.log(token)

    const expiresIn = user.expires || 0;
    console.log(expiresIn)
    console.log(!!token && expiresIn > new Date().getTime())

    return Promise.resolve(!!token && (expiresIn * 1000) > new Date().getTime());
  }


  redirectAuth() {
    localStorage.clear();
    this.router.navigate(['login']);
    // tslint:disable-next-line:max-line-length
    // window.location.href = `${this.aacUrl}/eauth/authorize?response_type=token&client_id=${this.aacClientId}&scope=${this.scope}&redirect_uri=${this.redirectUrl}`;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['login']);
    // sessionStorage.clear();
    // const redirect = `${this.aacUrl}/logout?target=${window.location.href}`;
    // window.location.href = redirect;
  }
  getToken() {
    console.log('gettoken');

    var user = JSON.parse(localStorage.getItem('google_user'))
    console.log(user);

    if (user) {
      const token = user.accessToken;
      return token;
    }
    return null;
  }


  authorizeProvider(token): Promise<any> {

    return new Promise((resolve, reject) => {

      var processThat = false;

      var authUrl;
      // Build the OAuth consent page URL
      authUrl = this.settings.aacUrl + AAC.AUTHORIZE_URI + '/' + PROVIDER_NATIVE.GOOGLE;;
      authUrl += '?client_id=' + this.settings.clientId + '&response_type=code' + '&redirect_uri=' + AAC.REDIRECT_URL;
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

        if (this.settings.loginType == LOGIN_TYPE.AAC) {
          success = AAC.SUCCESS_REGEX.exec(url);
          error = AAC.ERROR_REGEX.exec(url);
        } else if (this.settings.loginType == LOGIN_TYPE.COOKIE) {
          // TODO cookie
          success = this.settings.customConfig.SUCCESS_REGEX.exec(url);
          error = this.settings.customConfig.ERROR_REGEX.exec(url);
        }

        if (w && (success || error)) {
          // Always close the browser when match is found
          w.close();
          authWindow = null;
        }

        if (success) {
          if (this.settings.loginType == LOGIN_TYPE.AAC) {
            var code = success[1];
            if (code.substring(code.length - 1) == '#') {
              code = code.substring(0, code.length - 1);
            }
            console.log('[LOGIN] AAC code obtained');
            return Promise.resolve(code);
          } else if (this.settings.loginType == LOGIN_TYPE.COOKIE) {
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
        authWindow.addEventListener('loadstart', (e) => {
          //console.log('[LOGIN] ' + e);
          var url = e.url;
          return processURL(url, authWindow);
        });
      }
    });
  };

  // getAACtoken(code): Promise<any> {
  //   console.log('getAACToken');

  //   var url = "https://am-dev.smartcommunitylab.it/aac/oauth/token";

  //   return this.http.post(url, null, {
  //     params: {
  //       'client_id': "2be89b9c-4050-4e7e-9042-c02b0d9121c6",
  //       'client_secret': "7deb5fab-b9f6-4363-b6ca-3acccabdce81",
  //       'code': code,
  //       'redirect_uri': "http://localhost",
  //       'grant_type': 'authorization_code'
  //     }
  //   }).toPromise().then(response => {
  //     if (!!response["data"]["access_token"]) {
  //       console.log('[LOGIN] AAC token obtained');
  //       return Promise.resolve(response["data"]);
  //     } else {
  //       return Promise.resolve(null);
  //     }
  //   }
  //   );
  // };

  login(provider, credentials): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.libConfigOK) {
        console.log('[LOGIN] ' + 'Invalid configuration');
        reject('Invalid configuration');
      }

      var validProvider = false;
      for (var key in this.PROVIDER) {
        if (validProvider == false && provider == this.PROVIDER[key]) {
          validProvider = true;
        }
      }

      if (!validProvider) {
        reject('Invalid provider');
      }
      switch (provider) {
        case this.PROVIDER.INTERNAL:
          if (!credentials || !credentials.email || !credentials.password) {
            reject('Invalid credentials');
            break;
          }

          if (this.settings.loginType == this.LOGIN_TYPE.AAC) {
            /*
            Uses the internal AAC sign-in system
            */
            this.getAACtokenInternal(credentials).then(
               (tokenInfo)  => {
                this.saveToken(tokenInfo);
                this.user.provider = provider;
                console.log('[LOGIN] logged in with ' + this.user.provider);
                this.getRemoteAACCompleteProfile(this.user.tokenInfo).then(
                   (profile) => {
                    this.user.profile = profile;
                    localStorage.setItem('user', JSON.stringify(this.user));
                    this.userLocalStorage.saveUser();
                    resolve(profile);
                  },
                  (reason) => {
                    reject(reason);
                  }
                );
              },
              (reason) => {
                reject(reason);
              }
            );
          } else if (this.settings.loginType == this.LOGIN_TYPE.COOKIE) {
            this.http.get(this.settings.customConfig.LOGIN_URL, {
              params: {
                email: credentials.email,
                password: credentials.password
              },
              headers: {
                'Accept': 'application/json',
              }
            }).toPromise()
              .then(
                (response) => {
                  this.saveToken();
                  this.user.provider = provider;
                  console.log('[LOGIN] logged in with ' + this.user.provider);
                  this.user.profile = response["data"];
                  localStorage.setItem('user', JSON.stringify(this.user));
                  resolve(response["data"]);
                }
              ).catch(response => {
                reject(response);
              });
            // $http.get(settings.customConfig.LOGIN_URL, {
            //   params: {
            //     email: credentials.email,
            //     password: credentials.password
            //   },
            //   headers: {
            //     'Accept': 'application/json',
            //   }
            // }).then(
            //   (response) => {
            //     saveToken();
            //     this.user.provider = provider;
            //     console.log('[LOGIN] logged in with ' + this.user.provider);
            //     this.user.profile = response.data;
            //     localStorage.setItem('user',JSON.stringify(this.user));
            //     resolve(response.data);
            //   },
            //   (reason) => {
            //     reject(reason);
            //   }
            // );
          }
          break;
        default:
          reject('Provider "' + provider + '" still unsupported.');
      }
    })
  };

  getAACtokenInternal(credentials): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(this.settings.aacUrl + AAC.TOKEN_URI, null, {
        params: {
          'username': credentials.email,
          'password': credentials.password,
          'client_id': this.settings.clientId,
          'client_secret': this.settings.clientSecret,
          'grant_type': 'password'
        },
        headers: {
          'Accept': 'application/json',
        }
      })
        .toPromise()
        .then(
          (response) => {
            if (!!response["access_token"]) {
              console.log('[LOGIN] AAC token obtained');
              resolve(response);
            } else {
              reject(!!response["exception"] ? response["exception"] : null);
            }
          }
        ).catch(response => {
          reject(response);
        });
      // $http.post(settings.aacUrl + AAC.TOKEN_URI, null, {
      //   params: {
      //     'username': credentials.email,
      //     'password': credentials.password,
      //     'client_id': settings.clientId,
      //     'client_secret': settings.clientSecret,
      //     'grant_type': 'password'
      //   },
      //   headers: {
      //     'Accept': 'application/json',
      //   },
      //   timeout: 10000
      // }).then(
      //   (response) => {
      //     if (!!response.data.access_token) {
      //       console.log('[LOGIN] AAC token obtained');
      //       resolve(response.data);
      //     } else {
      //       reject(!!response.data.exception ? response.data.exception : null);
      //     }
      //   },
      //   (reason) => {
      //     reject(reason);
      //   }
      // );
    })


  };
  saveTokenInfo () {
    localStorage.setItem("user_tokenInfo", JSON.stringify(this.user.tokenInfo));
  }
  saveToken(tokenInfo?) {
    if (!!tokenInfo) {
      this.user.tokenInfo = tokenInfo;
      // set expiry (after removing 1 hr).
      var t = new Date();
      t.setSeconds(t.getSeconds() + (this.user.tokenInfo.expires_in - (60 * 60)));
      // FIXME only dev purpose
      //t.setSeconds(t.getSeconds() + 10);
      // FIXME /only dev purpose
      this.user.tokenInfo.validUntil = t;
    }
    this.saveTokenInfo();
  };

    getRemoteAACBasicProfile (tokenInfo) {

      return new Promise((resolve, reject) => {
        this.http.get(this.settings.aacUrl + AAC.BASIC_PROFILE_URI, {
          headers: {
            'Authorization': 'Bearer ' + tokenInfo.access_token
          }
        })
          .toPromise()
          .then(
            (response) => {
              resolve(response);
            }
          ).catch(response => {
            reject(response);
          });
        // $http.get(settings.aacUrl + AAC.BASIC_PROFILE_URI, {
        //   headers: {
        //     'Authorization': 'Bearer ' + tokenInfo.access_token
        //   },
        //   timeout: 10000
        // }).then(
        //   (response) => {
        //     resolve(response.data);
        //   },
        //   (reason) => {
        //     reject(reason);
        //   }
        // );
      })
    };
    getRemoteAACAccountProfile(tokenInfo) {
      return new Promise((resolve, reject) => {
        this.http.get(this.settings.aacUrl + AAC.ACCOUNT_PROFILE_URI, {
          headers: {
            'Authorization': 'Bearer ' + tokenInfo.access_token
          }
        })
          .toPromise()
          .then(
            (response) => {
              resolve(response);
            }
          ).catch(response => {
            reject(response);
          });

        // $http.get(settings.aacUrl + AAC.ACCOUNT_PROFILE_URI, {
        //   headers: {
        //     'Authorization': 'Bearer ' + tokenInfo.access_token
        //   },
        //           timeout: 10000
        // }).then(
        //    (response) => {
        //     resolve(response.data);
        //   },
        //    (reason) => {
        //     reject(reason);
        //   }
        // );

      })

    };
    getRemoteAACCompleteProfile (tokenInfo) {
      return new Promise((resolve, reject) => {
        this.getRemoteAACBasicProfile(tokenInfo).then(
          (profile) => {
            if (!!profile && !!profile["userId"]) {
              this.getRemoteAACAccountProfile(tokenInfo).then(
                (accountProfile) => {
                  for (var authority in accountProfile["accounts"]) {
                    for (var k in accountProfile["accounts"][authority]) {
                      if (k.indexOf('email') >= 0 && !!accountProfile["accounts"][authority][k]) {
                        profile["email"] = accountProfile["accounts"][authority][k];
                      }
                    }
                  }
                  resolve(profile);
                },
                (reason) => {
                  resolve(profile);
                }
              );
            } else {
              resolve(profile);
            }
          },
          (reason) => {
            reject(reason);
          }
        );

      })

    }
  };




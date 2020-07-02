import { Platform } from '@ionic/angular';
import { Injectable, NgZone } from '@angular/core';

import { IonicAuth, IonicAuthorizationRequestHandler, DefaultBrowser, AuthActionBuilder} from 'ionic-appauth';
import { CordovaRequestorService } from './cordova/cordova-requestor.service';
import { BrowserService } from './cordova/browser.service';
import { SecureStorageService } from './cordova/secure-storage.service';
import { StorageService } from './angular/storage.service';
import { RequestorService } from './angular/requestor.service';
import { IonicImplicitRequestHandler } from 'ionic-appauth/lib/implicit-request-handler';

import { TokenResponse } from '@openid/appauth';

import { environment } from '../../environments/environment';

/**
 * Authentication service. Should be called on app startup to subscribe to the app navigation.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends IonicAuth  {

  constructor(
    requestor: RequestorService,
    cordovaRequestor: CordovaRequestorService,
    secureStorage: SecureStorageService,
    storage: StorageService,
    browser: BrowserService,
    private platform: Platform,
    private ngZone: NgZone,
  ) {
    super(
      (platform.is('android') || platform.is('ios')) ? browser : undefined,
      (platform.is('android') || platform.is('ios')) ? secureStorage : storage,
      (platform.is('android') || platform.is('ios')) ? cordovaRequestor : requestor,
      undefined, undefined,
       new IonicAuthorizationRequestHandler(new DefaultBrowser(), storage)
                               
      // new IonicAuthorizationRequestHandler(new DefaultBrowser(), storage)
    );

    this.addConfig();
  }

  /**
   * Override to handle cordova callback
   */
  public async startUpAsync() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      (<any>window).handleOpenURL = (callbackUrl) => {
        this.ngZone.run(() => {
          console.log(callbackUrl);
            this.handleCallback(callbackUrl);
        });
      };
    }

    super.startUpAsync();
  }

  /**
   * Extension to manage correctly the implicit token refresh: no token expected, so do logout and return null
   * @param token: token data to refresh
   */
  protected async requestNewToken(token: TokenResponse): Promise<TokenResponse | undefined>  {
    if (!!token.refreshToken) {
      await this.requestRefreshToken(token);
      return this.getTokenFromObserver();
    } else {
      await this.EndSessionCallBack();
      return undefined;
    }
  }


  /**
   * Extension to force cleanup even before end session confirmation. Optional, may be revised.
   */
  public async signOut() {
    console.log("starting sign out");
    await super.signOut();
    console.log("starting end session callback");

    //this.EndSessionCallBack();
    console.log("after end session callback");

    // this.storage.removeItem('token_response');
    // this.authSubject.next(AuthActionBuilder.SignOutSuccess());
  }

  private addConfig() {
    console.log('add config');
    if (this.platform.is('android') || this.platform.is('ios')) {
      console.log('cordova');
      this.authConfig = {
        identity_client: environment["cordova_identity_client"],
        identity_server: environment["cordova_identity_server"],
        redirect_url: environment["cordova_redirect_url"],
        scopes: environment["cordova_scopes"],
        usePkce: true,
        end_session_redirect_url: environment["cordova_end_session_redirect_url"],
      };
    } else {
      this.authConfig = {
        identity_client: environment["implicit_identity_client"],
        identity_server: environment["implicit_identity_server"],
        redirect_url: environment["implicit_redirect_url"],
        scopes: environment["implicit_scopes"],
        usePkce: true,
        end_session_redirect_url: environment["implicit_end_session_redirect_url"],
      };
    }
  }

  private handleCallback(callbackUrl: string): void {
    console.log("handle callback: "+callbackUrl);
    if ((callbackUrl).indexOf(this.authConfig.redirect_url) === 0) {
      console.log("authorization");
      //decode and strip last char if the string ends with #. 
      //This issue is connected with a problem with HTTP2 and the Android library below
      //customurlscheme that send and Intent with a # at the end of the string as it was aprt of 
      //parameter instead part of the fragment 
      if (callbackUrl.slice(-1)=='#'){
        callbackUrl= callbackUrl.slice(0, -1)

      }
      callbackUrl=decodeURI(callbackUrl);

            this.AuthorizationCallBack(callbackUrl);
    }

    if ((callbackUrl).indexOf(this.authConfig.end_session_redirect_url) === 0) {
      console.log("end session");

      this.EndSessionCallBack();
    }
  }
  private getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
}

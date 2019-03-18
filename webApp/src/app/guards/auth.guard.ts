import { AuthenticationService } from "../services/authentication.service";
// import { CanActivate, Router } from '@angular/router';
import {CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root'
})
// export class AuthGuard implements CanActivate {

//   constructor(public auth: AuthenticationService, public router: Router) { }

//   canActivate(): boolean {
//     if (!this.auth.isAuthenticated()) {
//       this.router.navigate(['login']);
//       return false;
//     }
//     return true;
//   }
// }
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private login: AuthenticationService, private router: Router) {}

  /**
   * Can navigate to internal pages only if the user is authenticated
   * @param route
   * @param state
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('AuthGuard#canActivate called');
    return this.login.checkLoginStatus().then(valid => {
      if (!valid) {
        console.log('come here for not valid');
        this.login.redirectAuth();
        // this.router.navigate(['/login']);
      }
      return valid;
    });
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canActivate(route, state);
  }
}

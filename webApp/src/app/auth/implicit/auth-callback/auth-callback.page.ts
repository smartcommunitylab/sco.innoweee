import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AuthActions } from 'ionic-appauth';
import { skipWhile, take } from 'rxjs/operators';

/**
 * Page to handle Authorization callback for implicit flow in browser-based version.
 * Should be customized by the app to handle app-specific redirects.
 */
@Component({
  template: '<p>Signing in...</p>'
})
export class AuthCallbackPage implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.fragment.subscribe((fragment: string) => {
      if (fragment.includes("error=access_denied"))
        this.navCtrl.navigateRoot('login');
    })
    this.authService.AuthorizationCallBack(this.router.url);
    this.authService.authObservable.pipe(
      skipWhile(action => {
        return action.action !== AuthActions.SignInSuccess && action.action !== AuthActions.SignInFailed
      }
      ),
      take(1))
      .subscribe((action) => {
        console.log('action.action ' + action.action);
        if (action.action === AuthActions.SignInSuccess) {
          this.navCtrl.navigateRoot('game-selection');
        } else {
          this.navCtrl.navigateRoot('login');
        }
      });
  }

}

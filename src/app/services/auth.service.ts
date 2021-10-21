import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { AUTH_CONFIG, AUTH_CONNECTION } from './auth.config';
import Auth0Cordova from '@auth0/cordova';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
import { isNil } from '../common/utils/type-guard/is-nil';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  Auth0 = new auth0.WebAuth(AUTH_CONFIG);
  Client = new Auth0Cordova(AUTH_CONFIG);
  accessToken: string;
  user: any;
  loggedIn: boolean;
  loading = true;

  constructor(
    public zone: NgZone,
    private storage: Storage,
    private safariViewController: SafariViewController,
    private router: Router
  ) { }

  async login() {
    this.loading = true;
    const options = {
      connection: AUTH_CONNECTION.connection,
      audience: 'https://example.example.com'

    };

    this.Client.authorize(options, (err, authResult) => {
      console.log(err);
      console.log(authResult);
      if (err) {
        // throw err;
      }

      this.zone.run(() => {
        this.loading = false;
        if (!isNil(authResult)) {
          this.storage.set('access_token', authResult.accessToken);
          this.accessToken = authResult.accessToken;
          this.loading = false;
          this.loggedIn = true;
          this.storage.set('logged', true);
          this.router.navigate(['/home'], {replaceUrl: true});
        }
      });
    });
  }

  logout() {
    this.accessToken = null;
    this.user = null;
    this.loggedIn = false;
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        const domain = AUTH_CONFIG.domain;
        const clientId = AUTH_CONFIG.clientId;
        const pkgId = AUTH_CONFIG.packageIdentifier;
        const url = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${pkgId}://${domain}/cordova/${pkgId}/callback`;

        if (available) {
          this.safariViewController.show({ url })
            .subscribe((result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'closed') {
                console.log('closed');
              }

              if (result.event === 'loaded') {
                this.storage.remove('access_token');
                this.storage.remove('logged');
                this.safariViewController.hide();
                this.router.navigate(['/login'], {replaceUrl: true});
              }
            },
            (error: any) => console.log('logout error', error)
          );
        }
      });
  }
}

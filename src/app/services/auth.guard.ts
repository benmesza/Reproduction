import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
  })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private storage: Storage
    ) {}

    async canActivate(): Promise<boolean> {
        const authed = await this.storage.get('logged');
        if (authed) {
            return true;
        } else {
            this.router.navigate(['/login']);
            return false;
        }
    }
}

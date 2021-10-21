import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CallLog } from '@ionic-native/call-log/ngx';
import { Platform, AlertController } from '@ionic/angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  version: string;

  constructor(
    public auth: AuthService,
    private callLog: CallLog,
    private platform: Platform,
    private appVersion: AppVersion,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      this.checkPermission();
      this.getAppVersion();
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.hardwareBack();
  }

  async login() {
    await this.auth.login();
  }

  logout() {
    this.auth.logout();
  }

  checkPermission() {
    this.callLog.hasReadPermission().then(hasPermission => {
      if (!hasPermission) {
        this.callLog.requestReadPermission().then(results => {
          console.log('requestpermission');
        })
        .catch(e => {
          console.log('requestPermission', JSON.stringify(e));
        });
      } else {
        console.log('requestpermission engedélyezés');
      }
    })
    .catch(e => {
      console.log('hasReadPermission', JSON.stringify(e));
    });
  }

  async getAppVersion() {
    this.version = await this.appVersion.getVersionNumber();
  }

  hardwareBack() {
    this.platform.backButton
      .pipe(
        untilDestroyed(this)
      ).subscribe(() => {
        this.exitAlert();
      });
  }

  async exitAlert() {
    const alert = await this.alertCtrl.create({
      message: 'Biztosan ki szeretne lépni az alkalmazásból?',
      buttons: [
        {
          text: 'Mégsem',
          role: 'cancel'
        },
        {
          text: 'Igen',
          handler: () => {
            navigator['app'].exitApp();
          }
        }
      ]
    });

    alert.present();
  }

}

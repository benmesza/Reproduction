import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import Auth0Cordova from '@auth0/cordova';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { Utils } from './common/utils/utils';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  todayCalls = [];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage
  ) {
    this.deleteYesterdayCalls();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#E91E63');
      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      
      (window as any).handleOpenURL = (url: string) => {
        console.log(url);
        Auth0Cordova.onRedirectUri(url);
      };
    });
  }

  async deleteYesterdayCalls() {
    const localdata = await this.storage.get('calls');
    const today = moment().format('L');
    const timestamp = moment(today).valueOf();

    if (localdata !== null) {
      const filterTodayCalls = localdata.filter(el => el.date > timestamp);
      if (filterTodayCalls.length > 0) {
        const array = filterTodayCalls.map(calls => (
          {
            name: calls.name,
            number: calls.number,
            date: calls.date,
            endDate: new Date(new Date(calls.date).getTime() + (calls.duration * 1000)),
            type: calls.type,
            duration: calls.duration,
            durationInMinute: Utils.callDuration(calls.duration),
            phoneAccountId: calls.phoneAccountId,
            status: calls.status
          }
        ));
        this.storage.remove('calls');
        this.storage.set('calls', array);
      } else {
        this.storage.remove('calls');
      }
    }
  }
}

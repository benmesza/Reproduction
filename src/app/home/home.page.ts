import { Component, OnInit } from '@angular/core';
import { CallLog, CallLogObject } from '@ionic-native/call-log/ngx';
import { Platform, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { Router, NavigationExtras } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isNil } from '../common/utils/type-guard/is-nil';
import { Utils } from '../common/utils/utils';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  filters: CallLogObject[];
  loading = true;
  listArray = [];
  filteredListArray = [];
  todayCalls = [];
  notFound = false;
  selectedTab: any;

  constructor(
    private callLog: CallLog,
    private platform: Platform,
    private storage: Storage,
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      this.checkPermission();

      document.addEventListener('resume', () => {
        this.getContacts();
      });
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getContacts();
    this.hardwareback();
  }

  async getContacts() {
    const today = moment().format('L');
    const timestamp = moment(today).valueOf();
    const sim = await this.storage.get('used_sim');
    this.filters = [
      {
        name: 'date',
        value: timestamp.toString(),
        operator: '>='
      },
      {
        name: 'duration',
        value: '0',
        operator: '>'
      }
    ];
    from(this.callLog.getCallLog(this.filters))
      .pipe(
        untilDestroyed(this),
        map((results) => !isNil(sim) ? results.filter(el => el.phoneAccountId !== sim) : results)
      )
      .subscribe((results) => {
        this.storage.get('calls').then((localData) => {
          if (isNil(localData)) {
            const array = results.map(result => (
              {
                name: result.name,
                number: result.number,
                date: result.date,
                endDate: new Date(new Date(result.date).getTime() + (result.duration * 1000)),
                type: result.type,
                duration: result.duration,
                durationInMinute: Utils.callDuration(result.duration),
                phoneAccountId: result.phoneAccountId,
                status: 'none'
              }
            ));
            array.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
            this.storage.set('calls', array);
          } else {
            const filter = localData.map(el => el.date);
            const filtered = results.filter(result => !filter.includes(result.date));
            if (filtered.length !== 0) {
              const array = filtered.map(filterData => (
                {
                  name: filterData.name,
                  number: filterData.number,
                  date: filterData.date,
                  endDate: new Date(new Date(filterData.date).getTime() + (filterData.duration * 1000)),
                  type: filterData.type,
                  duration: filterData.duration,
                  durationInMinute: Utils.callDuration(filterData.duration),
                  phoneAccountId: filterData.phoneAccountId,
                  status: 'none'
                }
              ));
              this.filteredListArray = localData.concat(array);
              this.filteredListArray.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
              this.storage.set('calls', this.filteredListArray);
            }
          }
          this.selectedTab = 'none';
        });
      });
  }

  checkPermission() {
    this.callLog.hasReadPermission().then(hasPermission => {
      if (!hasPermission) {
        this.callLog.requestReadPermission().then(results => {
          this.getContacts();
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

  async segmentChanged(ev: any) {
    const segmentValue = ev.detail.value;
    this.selectedTab = ev.detail.value;
    this.listArray = await this.storage.get('calls');
    if (this.listArray !== null) {
      this.listArray.sort((a, b) => (new Date(a.date) as any) - (new Date(b.date) as any));
      if (segmentValue === '1' || segmentValue === '2') {
        if (this.listArray.length !== 0) {
          if (segmentValue === '1') {
            this.filteredListArray = this.listArray.filter(el => el.type === 1);
            this.filteredListArray.length === 0 ? this.notFound = true : this.notFound = false;
          } else {
            this.filteredListArray = this.listArray.filter(el => el.type === 2);
            this.filteredListArray.length === 0 ? this.notFound = true : this.notFound = false;
          }
        }
      } else {
        this.filteredListArray = this.listArray.filter(el => el.status === 'none' && (el.type === 1 || el.type === 2));
        this.filteredListArray.length === 0 ? this.notFound = true : this.notFound = false;
      }
    } else {
      this.notFound = true;
    }
  }

  goToDetails(call) {
    const navigationExtras: NavigationExtras = {
      state: {
        data: call,
      },
      replaceUrl: true
    };
    this.router.navigate(['/call-details'], navigationExtras);
  }

  logout() {
    this.authService.logout();
  }

  hardwareback() {
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

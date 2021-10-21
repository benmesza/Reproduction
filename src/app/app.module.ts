import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CallLog } from '@ionic-native/call-log/ngx';
import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';

import { IonicStorageModule } from '@ionic/storage';

import { HttpConfigInterceptor } from './interceptors/httpconfig.interceptor';
import { HttpTokenInterceptor } from './interceptors/httptoken.interceptor';
import { SubdomainInterceptor } from './interceptors/subdomain.interceptor';
// import { HttpRequestInterceptor } from '../app/interceptors/http-loading.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    CommonModule,
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallLog,
    SpeechRecognition,
    SafariViewController,
    AppVersion,
    Clipboard,
    InAppBrowser,
    HttpClientModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    { provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: { color: 'primary' } },
    { provide: HTTP_INTERCEPTORS, useClass: SubdomainInterceptor, multi: true }
    /*{ provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }*/
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

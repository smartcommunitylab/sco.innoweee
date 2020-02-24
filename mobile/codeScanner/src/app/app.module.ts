import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { APP_CONFIG_TOKEN, APP_CONFIG } from './app-config';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthenticationService } from './services/authentication.service';
import { AuthGuard } from './guards/auth.guard';
import {TokenInterceptor} from './interceptors/token-interceptor'

registerLocaleData(localeIt, 'it');
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    GooglePlus,
    AuthenticationService,
    AuthGuard,
    { provide: LOCALE_ID, useValue: 'it-IT' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: APP_CONFIG_TOKEN, useValue: APP_CONFIG }

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

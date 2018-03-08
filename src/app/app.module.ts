import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Sources } from '../pages/sources/sources';

import { ModalContentPage } from '../pages/sources/sourceModal';

import { SharingModal } from '../pages/sources/sharingModal';

import { MenuPage } from '../pages/navpage/menu';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/Login/login';
import { CategoryFilterPipe } from '../filters/articles.filter';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MenuPage,
    Sources,
    ModalContentPage,
    SharingModal,
    CategoryFilterPipe
  ],
  imports: [
    BrowserModule,

    HttpModule,

    IonicModule.forRoot(MyApp)
  ],
  exports: [
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    MenuPage,
    Sources,
    ModalContentPage,
    SharingModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

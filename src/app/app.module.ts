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
import { Clipboard } from '@ionic-native/clipboard';
import { ModalContentPage } from '../pages/sources/sourceModal';

import { SharingModalShared } from '../pages/sources/sharingModalShared';
import { SharingModal } from '../pages/sources/sharingModal';

import { SharedPage } from '../pages/article/shared';
import { ArticleStats } from '../pages/article/articlestats';

import { StatsPage } from '../pages/stats/stats';

import { CountryStats } from '../pages/stats/countrystats';

import { MenuPage } from '../pages/navpage/menu';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../pages/Login/login';
import { CategoryFilterPipe } from '../filters/articles.filter';

import { FusionChartsModule } from 'angular2-fusioncharts';

// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import * as FintTheme from 'fusioncharts/themes/fusioncharts.theme.fint';

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, FintTheme);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    StatsPage,
    MenuPage,
    Sources,
    SharedPage,
    ArticleStats,
    CountryStats,
    ModalContentPage,
    SharingModal,
    SharingModalShared,

    CategoryFilterPipe
  ],
  imports: [
    BrowserModule,

    HttpModule,
    FusionChartsModule,
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
    StatsPage,
    SharedPage,
    ArticleStats,
    CountryStats,
    ModalContentPage,
    SharingModal,
    SharingModalShared
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Facebook,
    NativeStorage,
    Clipboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

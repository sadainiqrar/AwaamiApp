import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController, Platform, NavParams } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginPage } from '../Login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ArticleService } from '../../services/articles.service';
import { SharingModalShared } from '../../pages/sources/sharingModalShared';
import { StatsService } from '../../services/stats.service';
import { SourcesService } from '../../services/sources.service';
import { User,  C_Stats } from '../../Models/models';
@Component({
  selector: 'page-home',
  templateUrl: 'countrystats.html',
  providers: [ArticleService, StatsService, SourcesService]
})
export class CountryStats {
  

  cStats: C_Stats;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private sourcesService: SourcesService,
    private clipboard: Clipboard, public platform: Platform,
    public params: NavParams,
    public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController,
    private fb: Facebook, private nativeStorage: NativeStorage, private articleService: ArticleService, private statsService: StatsService) {

    let env = this;
    let nav = this.navCtrl
    this.cStats = this.params.get('stats')
  }










  



}

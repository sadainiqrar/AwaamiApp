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
import { User, Article, Source } from '../../Models/models';

import { CountryStats } from '../stats/countrystats';
@Component({
  selector: 'page-home',
  templateUrl: 'stats.html',
  providers: [ArticleService, StatsService, SourcesService]
})
export class StatsPage {
  @ViewChild(Slides) slides: Slides;
  FB_APP_ID: number = 141614143143756;
  currentUser: User;

  userStats;

  monthlytraffic: number = 0;
  earnedToday: number = 0.0;
  earnedMonth: number = 0.0;
  article: Article;
  d: Date;
  to: Date;
  from: Date;
  fromString: string;
  toString: string;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private sourcesService: SourcesService,
    private clipboard: Clipboard, public platform: Platform,
    public params: NavParams,
    public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController,
    private fb: Facebook, private nativeStorage: NativeStorage, private articleService: ArticleService, private statsService: StatsService) {

    let env = this;
    let nav = this.navCtrl
    this.currentUser = this.params.get('user')
    this.article = this.params.get('article');
    this.d = new Date()
    this.to = new Date();
    this.d.setDate(this.d.getDate() - 7);
    this.from = this.d;
    this.fromString = this.getDateString(this.from);
    this.toString = this.getDateString(this.to);
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
    this.nativeStorage.getItem('currentUser')
      .then(
      data => {
        console.log('idhar');
        this.currentUser = data

        console.log(this.currentUser)
        env.fb.getLoginStatus().then(
          data => {
            console.log(data);
            if (data.status !== 'connected') {
              env.nativeStorage.remove('currentUser').then(
                () => {
                  console.log('back to login 1');
                  nav.push(LoginPage);
                }
              );
            }
            else if (data.status === 'connected') {
              console.log("Load Initializers");
              env.loadStats(env.currentUser.uid, env.currentUser.username);
              env.loadFullStats(env.currentUser.uid, env.from, env.to, env.currentUser.username);
            }
          },
          error => {

            console.error(error)
            env.nativeStorage.remove('currentUser').then(
              () => {
                console.log('back to login 2');
                nav.push(LoginPage);
              }
            );
          }
        );
      },
      error => {
        console.error(error)
        nav.push(LoginPage);
      });
   

  }

  getDateString(date)
  {
    return date.getFullYear() + '-' + (date.getMonth() > 9 ? date.getMonth() : '0' + date.getMonth()) + '-' + (date.getDate() > 9 ? '' + date.getDate() : '0' + date.getDate()) ;
  }

  update()
  {
    this.from = new Date(this.fromString);
    this.to = new Date(this.toString);

    this.loadFullStats(this.currentUser.uid, this.from, this.to, this.currentUser.username);

  }

  reRoute(s) {
    console.log('reRoute clicked');
    let stats = s;
    let env = this;

    env.navCtrl.push(CountryStats, { 'stats': stats });


  }







  loadFullStats(_uid, _from,_to,_username)
  {
    let env = this;
    env.statsService.get_statistics(_uid, _from, _to, _username).subscribe(res => {
      env.userStats = res;
    }, error => console.log('Some error'));
  }



  loadStats(uid, username) {
    console.log("Stats Loading");
    this.statsService.getStats(uid, username).subscribe(res => {
      this.monthlytraffic = res.monthlyTraffic;
      this.earnedMonth = res.monthlyEarned;
      this.earnedToday = res.todayEarned;
    }, error => console.log('Some error'));

  }



}

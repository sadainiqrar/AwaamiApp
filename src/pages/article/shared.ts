import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, ActionSheetController, Platform } from 'ionic-angular';
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

import { ArticleStats } from '../article/articlestats';
import { User, Article, Source } from '../../Models/models';
@Component({
  selector: 'page-home',
  templateUrl: 'shared.html',
  providers: [ArticleService, StatsService, SourcesService]
})
export class SharedPage {
  @ViewChild(Slides) slides: Slides;
  FB_APP_ID: number = 141614143143756;
  currentUser: User;

  dbSources: Array<string> = new Array<string>();
  addedSources: Array<Source> = new Array<Source>();

  articles: Array<Article> = new Array <Article>();
  monthlytraffic: number = 0;
  earnedToday: number = 0.0;
  earnedMonth: number = 0.0;
  _category = "Premium";
  _sub_category = "Political";
  filters = [{ "id": "All", "value": "Political" }, { "id": "Entertainment", "value": "Entertainment" }, { "id": "Showbiz", "value":  "Showbiz" },
    { "id": "Sports", "value": "Sports" }, { "id": "News", "value": "News" }, { "id": "Motivation", "value": "Motivation" }, { "id": "Health", "value":  "Health" }];

  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private sourcesService: SourcesService,
    private clipboard: Clipboard, public platform: Platform,
    public toastCtrl: ToastController, public actionsheetCtrl: ActionSheetController,
    private fb: Facebook, private nativeStorage: NativeStorage, private articleService: ArticleService, private statsService: StatsService) {
    this.fb.browserInit(this.FB_APP_ID, "v2.8");
    let env = this;
    let nav = this.navCtrl
    this.nativeStorage.getItem('currentUser')
      .then(
      data => {
        console.log('idhar');
        this.currentUser = data

        console.log(this.currentUser)
        env.fb.getLoginStatus().then(
          data => {
            console.log(data);
            if (data.status !== 'connected')
            {
              env.nativeStorage.remove('currentUser').then(
                () => {
                  console.log('back to login 1');
                  nav.push(LoginPage);
                }
              );
            }
            else if (data.status === 'connected')
            {
              console.log("Load Initializers");
             // env.loadStats(env.currentUser.uid, env.currentUser.username);
              env.loadArticles(env.currentUser.uid, env._sub_category);
              env.loadSources(env.currentUser.uid);
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

  goToSlide() {
    this.slides.slideTo(2, 500);
  }

  share(s) {
    console.log('share clicked');
    let serial = s;
    let env = this;
    let index = env.articles.map(x => x.serial_no).indexOf(serial)
    let article = index == -1 ? null : env.articles[index];
    let modal = this.modalCtrl.create(SharingModalShared, { "article": article, "sources": env.addedSources, "user": this.currentUser });
    modal.onDidDismiss(data => {
      console.log("returned data", data);
    });
    modal.present();
  }


  reRoute(s) {
    console.log('reRoute clicked');
    let serial = s;
    let env = this;
    let index = env.articles.map(x => x.serial_no).indexOf(serial)
    let article = index == -1 ? null : env.articles[index];

    env.navCtrl.push(ArticleStats, { 'article': article, 'user': env.currentUser });

    
  }


  openMenu(s) {
    let env = this;
    let serial = s;
    let index = env.articles.map(x => x.serial_no).indexOf(serial)

    let article = index == -1 ? null : env.articles[index];
    console.log("check here", article);
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Action',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Share',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'share' : null,
          handler: () => {
            console.log('share clicked');
            env.share(article.serial_no);




          }
        },
        {
          text: 'Copy',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'copy' : null,
          handler: () => {
            console.log('Copy clicked');
            env.copy(article.serial_no);




          }
        }
      ]
    });
    actionSheet.present();
  }


  copy(s) {
    console.log('copy clicked');
    let serial = s;
    let env = this;
    let index = env.articles.map(x => x.serial_no).indexOf(serial)
    let article = index == -1 ? null : env.articles[index];
    

    env.sourcesService.shorten(article.url, env.currentUser.uid)
      .subscribe(res => {
        console.log(res);

        env.clipboard.copy(res).then(rs => {
          env.articleService.updateCopiedArticles(env.currentUser.uid, article.serial_no, article.shared)
            .subscribe(res => {
              env.toastCtrl.create({
                message: 'Copied To ClipBoard',
                duration: 3000,
                position: 'bottom'
              }).present();
            }, error => {
              env.toastCtrl.create({
                message: 'Error Copying',
                duration: 3000,
                position: 'bottom'
              }).present();


            });
        }).catch(error => {
          env.toastCtrl.create({
            message: 'Error Copying',
            duration: 3000,
            position: 'bottom'
          }).present();
          
        });
        




      });



  }


  loadArticles(uid,category)
  {

    let env = this;
    console.log("article Loading with: " + uid + category);
    this.articleService.getSharedArticles(uid, category).subscribe(res => {
      console.log(res);
      this.articles = res;
      console.log(this.articles[0].title);

      for (let article of env.articles) {
        env.statsService.getArticleStats(article.site_url, article.modified_date, article.url, env.currentUser.username).subscribe(res => {
          article.views = res.sessions;
          article.shares = res.earned;
        }, err => {
          article.views = "0";
          article.shares = 0;
        }
        );
      }



    });
  }
  loadStats(uid,username)
  {
    console.log("Stats Loading");
    this.statsService.getStats(uid, username).subscribe(res => {
      this.monthlytraffic = res.monthlyTraffic;
      this.earnedMonth = res.monthlyEarned;
      this.earnedToday = res.todayEarned;
    }, error => console.log('Some error'));
    

  }


  loadSources(uid)
  {
    let env = this;
    console.log("Sources Loading with: " + uid);
    let params = new Array<string>();
    this.sourcesService.getSources(uid).subscribe(res => {
      console.log(res);
      this.dbSources = res;
      env.fb.api("/me/accounts?fields=id,name,category,picture.type(large),fan_count,overall_star_rating,link,access_token", params)
        .then(function (sources) {
          console.log(sources.data);
          for (let source of sources.data) {
            if (env.dbSources.indexOf(source.id) !== -1) {
              env.addedSources.push(source)
            }

          }


          console.log("Added Sources", env.addedSources)

        })
        .then(function () {
          console.log("No Sources");
        }, function (error) {
          console.log(error);
        })



    });
  }


}

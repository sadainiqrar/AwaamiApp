import { Component } from '@angular/core';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { Clipboard } from '@ionic-native/clipboard';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginPage } from '../Login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ArticleService } from '../../services/articles.service';
import { SharingModal } from '../../pages/sources/sharingModal';
import { StatsService } from '../../services/stats.service';
import { SourcesService } from '../../services/sources.service';
import { User, Article, Source } from '../../Models/models';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ArticleService, StatsService, SourcesService]
})
export class HomePage {
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
    private clipboard: Clipboard,
    public toastCtrl: ToastController,
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
              env.loadStats(env.currentUser.uid, env.currentUser.username);
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
    let index = env.articles.map(x => x.serial_no).indexOf(serial);
    let article = index == -1 ? null : env.articles[index];
    let modal = this.modalCtrl.create(SharingModal, { "article": article, "sources": env.addedSources, "user": this.currentUser });
    modal.onDidDismiss(data => {
      console.log("returned data", data);
      env.loadArticles(env.currentUser.uid, env._sub_category);
    });
    modal.present();
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
          env.articleService.insertCopiedArticles(env.currentUser.uid, article.serial_no)
            .subscribe(res => {
              env.toastCtrl.create({
                message: 'Copied To ClipBoard',
                duration: 3000,
                position: 'bottom'
              }).present();
              env.loadArticles(env.currentUser.uid, env._sub_category);
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


    console.log("article Loading with: " + uid + category);
    this.articleService.getArticles(uid, category).subscribe(res => {
      console.log(res);
      this.articles = res;
      console.log(this.articles[0].title);
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

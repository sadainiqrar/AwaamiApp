import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SourcesService } from '../../services/sources.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { ArticleService } from '../../services/articles.service';
import { Platform, ActionSheetController, ModalController, NavParams, ViewController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Sources } from '../../pages/sources/sources';
import { User, Source, Article } from '../../Models/models';
@Component({
  selector: 'modal-sources',
  templateUrl: 'sharingModalShared.html',
  providers: [SourcesService, ArticleService]
})
export class SharingModalShared  {
  FB_APP_ID: number = 141614143143756;
  currentUser: User;
  sources: Array<Source> = new Array<Source>();
  addSources: Array<Source> = new Array<Source>();
  article: Article;
  hideme: Array<Boolean> = new Array<Boolean>();
  constructor(public navCtrl: ViewController,
    public platform: Platform, public modalCtrl: ModalController,
    private sourcesService: SourcesService,
    private articleService: ArticleService,
    public toastCtrl: ToastController,
    public loading: LoadingController,
    public actionsheetCtrl: ActionSheetController, private fb: Facebook, private nativeStorage: NativeStorage, public params: NavParams, ) {
    this.sources = this.params.get('sources');
    this.currentUser = this.params.get('user')
    this.article = this.params.get('article');
    console.log(this.sources);

    console.log("here user", this.currentUser);
    console.log("sources: ", this.sources);
  }

  dismiss() {
    this.navCtrl.dismiss();
  }


  share(pid)
  {

    let umsid = pid;
    let params = new Array<string>();
    let env = this;
    let index = env.sources.map(x => x.id).indexOf(pid)
    console.log(index);
    console.log("sources", env.sources);
    console.log(umsid);
    let source = index == -1 ? null : env.sources[index];

    let loader = this.loading.create({
      content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div></div>'
    });
    loader.present().then(() => {
    env.sourcesService.shorten(env.article.url, env.currentUser.uid)
      .subscribe(res => {
        console.log(res);
        env.fb.api("/me/feed?access_token=" + source.access_token + "&method=post&link=" + res, params)
          .then(function (sources) {
            console.log(sources.data);
            env.toastCtrl.create({
              message: 'Shared Successfully',
              duration: 3000,
              position: 'bottom'
            }).present();
            env.articleService.updateSharedArticles(env.currentUser.uid, env.article.serial_no, env.article.copied)
              .subscribe(res => {

                loader.dismiss();
              }, error => {

                loader.dismiss();


              });

          })
          .then(function () {
            console.log("Shared");
          }, function (error) {
            console.log(error);
          })



      });
    });


    
    


  }


  

  }




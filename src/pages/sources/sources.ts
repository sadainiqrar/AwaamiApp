import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { LoginPage } from '../Login/login';
import { NativeStorage } from '@ionic-native/native-storage';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { ArticleService } from '../../services/articles.service';
import { Platform, ActionSheetController, ModalController } from 'ionic-angular';
import { SourcesService } from '../../services/sources.service';
import { ModalContentPage } from '../../pages/sources/sourceModal';
import { User, Source } from '../../Models/models';
@Component({
  selector: 'page-sources',
  templateUrl: 'sources.html',
  providers: [SourcesService]
})
export class Sources {
  @ViewChild(Slides) slides: Slides;
  FB_APP_ID: number = 141614143143756;
  currentUser: User;
  dbSources: Array<string> = new Array<string>();
  addedSources: Array<Source> = new Array<Source>();
  fbSources: Array<Source> = new Array<Source>();
  newSources: Array<Source> = new Array<Source>();

  constructor(public navCtrl: NavController,
    public platform: Platform, public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public actionsheetCtrl: ActionSheetController, private fb: Facebook, private nativeStorage: NativeStorage, private sourcesService: SourcesService) {
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
              env.loadDBSources(env.currentUser.uid);
              env.loadFBSources(env.currentUser.uid);
              env.loadAddedSources();
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
  
  addSource() {
    console.log('clicked');
    let modal = this.modalCtrl.create(ModalContentPage, { "source": this.newSources, "user": this.currentUser });
    modal.onDidDismiss(data => {
      console.log("returned data", data);
      for (let d of data) {
        this.addedSources.push(d);
      }
    });
    modal.present();
  }

  loadDBSources(uid)
  {
    
    console.log("Sources Loading with: " + uid);
    this.sourcesService.getSources(uid).subscribe(res => {
      console.log(res);
      this.dbSources = res;
      console.log(this.dbSources[0]);
    });
    
  }
  loadFBSources(uid)
  {
    console.log("Sources Loading");
    let params = new Array<string>();
    let env = this;
    env.fb.api("/me/accounts?fields=id,name,category,picture.type(large),fan_count,overall_star_rating,link", params)
        .then(function (sources) {
          console.log(sources.data);
          env.fbSources = sources.data;
          console.log(env.fbSources);
        })
        .then(function () {
          console.log("No Sources");
        }, function (error) {
          console.log(error);
        })
  }
  loadAddedSources() {
    console.log("Added Sources Loading");
    let params = new Array<string>();
    let env = this;
    env.fb.api("/me/accounts?fields=id,name,category,picture.type(large),fan_count,overall_star_rating,link", params)
      .then(function (sources) {
        console.log(sources.data);
        for (let source of sources.data) {
          if (env.dbSources.indexOf(source.id) !== -1) {
            env.addedSources.push(source)
          }
          else {
            env.newSources.push(source);
          }

        }


        console.log("Added Sources",env.addedSources)
        console.log(env.newSources)
        
      })
      .then(function () {
        console.log("No Sources");
      }, function (error) {
        console.log(error);
      })
  }


  openMenu(pid) {
    let env = this;
    let ums_id = pid;
    let index = env.addedSources.map(x => x.id).indexOf(pid)

    let source = index == -1 ? null : env.addedSources[index];
    console.log("check here",source);
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Action',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'trash' : null,
          handler: () => {
            console.log('Delete clicked');
            env.sourcesService.deleteSource(pid, env.currentUser.uid)
              .subscribe(res => {
                console.log(res);
                if (res === 0)
                {
                  env.toastCtrl.create({
                    message: 'Cannot Delete Only Available Source',
                    duration: 3000,
                    position: 'bottom'
                  }).present();
                }
                else {
                  env.toastCtrl.create({
                    message: 'Source Deleted Successfully',
                    duration: 3000,
                    position: 'bottom'
                  }).present();
                  env.newSources.push(source);
                  env.addedSources.splice(index, 1);
                  console.log('done deletion');
                }
              });


         

          }
        }
      ]
    });
    actionSheet.present();
  }



  }




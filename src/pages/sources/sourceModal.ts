import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SourcesService } from '../../services/sources.service';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { ArticleService } from '../../services/articles.service';
import { Platform, ActionSheetController, ModalController, NavParams, ViewController } from 'ionic-angular';

import { Sources } from '../../pages/sources/sources';
import { User, Source } from '../../Models/models';
@Component({
  selector: 'modal-sources',
  templateUrl: 'sourcesModal.html',
  providers: [SourcesService]
})
export class ModalContentPage  {
  FB_APP_ID: number = 141614143143756;
  currentUser: User;
  sources: Array<Source> = new Array<Source>();
  addSources: Array<Source> = new Array<Source>();
  constructor(public navCtrl: ViewController,
    public platform: Platform, public modalCtrl: ModalController,
    private sourcesService: SourcesService,

    public toastCtrl: ToastController,
    public actionsheetCtrl: ActionSheetController, private fb: Facebook, private nativeStorage: NativeStorage, public params: NavParams, ) {
    this.sources = this.params.get('source');
    this.currentUser = this.params.get('user')
    console.log(this.sources);
    console.log("here user", this.currentUser);
  }

  dismiss() {
    this.navCtrl.dismiss(this.addSources);
  }

  openMenu(pid) {
    let umsid = pid;
    let env = this;
    let index = env.sources.map(x => x.id).indexOf(pid)
    console.log(index);
    console.log("sources",env.sources);
    console.log(umsid);
    let source = index == -1 ? null : env.sources[index];
    console.log("This one check: ", source);
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Action',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Connect',
          role: 'destructive',
          icon: !this.platform.is('ios') ? 'add' : null,
          handler: () => {
            console.log('Add clicked');
            env.sourcesService.addSource(source.id, source.link, env.currentUser.uid)
              .subscribe(res => {
                console.log(res);
                  env.toastCtrl.create({
                    message: 'Source Connected',
                    duration: 3000,
                    position: 'bottom'
                }).present();
                  env.addSources.push(source);
                  env.sources.splice(index, 1);
                  console.log('done Addition');
                  console.log("New Sources", env.addSources);
              });



          }
        }
      ]
    });
    actionSheet.present();
  }

  }




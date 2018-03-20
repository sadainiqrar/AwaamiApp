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
@Component({
  selector: 'page-home',
  templateUrl: 'articlestats.html',
  providers: [ArticleService, StatsService, SourcesService]
})
export class ArticleStats {
  currentUser: User;
  dataSource: Object;
  dataSource2: Object;
  title: string;

  article: Article;
  d: Date;
  to: Date;
  from: Date;
  extra = 'week';
  trafficData = [];
  trafficDate = [];
  earnedData = [];
  countryData = [];
  sum = 0;
  filters = [{ "id": "Weekly", "value": "week" }, { "id": "Monthly", "value": "month" }, { "id": "Yearly", "value": "year" }];


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

    this.title = "Angular 2 FusionCharts Sample";

    this.dataSource = {
      "chart": {
        "subCaption": "Traffic and Revenue Generated",
        "paletteColors": "#0075c2,#1aaf5d",
        "bgColor": "#ffffff",
        "showBorder": "0",
        "showCanvasBorder": "0",
        "plotBorderAlpha": "10",
        "usePlotGradientColor": "0",
        "legendBorderAlpha": "0",
        "legendShadow": "0",
        "plotFillAlpha": "60",
        "showXAxisLine": "1",
        "axisLineAlpha": "25",
        "showValues": "0",
        "captionFontSize": "14",
        "subcaptionFontSize": "14",
        "subcaptionFontBold": "0",
        "divlineColor": "#999999",
        "divLineIsDashed": "1",
        "divLineDashLen": "1",
        "divLineGapLen": "1",
        "showAlternateHGridColor": "0",
        "toolTipColor": "#ffffff",
        "toolTipBorderThickness": "0",
        "toolTipBgColor": "#000000",
        "toolTipBgAlpha": "80",
        "toolTipBorderRadius": "2",
        "toolTipPadding": "5",
      },

      "categories": [
        {
          "category": this.trafficDate
        }
      ],

      "dataset": [
        {
          "seriesname": "Traffic",
          "data": this.trafficData
        },
        {
          "seriesname": "Earned",
          "data": this.earnedData
        }
      ]
    }


    this.dataSource2 = {
      "chart": {
        "subCaption": "Location",
        "paletteColors": "#0075c2",
        "bgColor": "#ffffff",

        "yAxisMaxValue": (this.sum * 0.2) + this.sum,
        "showBorder": "0",
        "showCanvasBorder": "0",
        "usePlotGradientColor": "0",
        "plotBorderAlpha": "10",
        "placeValuesInside": "0",
        "valueFontColor": "#ffffff",
        "showAxisLines": "1",
        "axisLineAlpha": "25",
        "divLineAlpha": "10",
        "alignCaptionWithCanvas": "0",
        "showAlternateVGridColor": "0",
        "captionFontSize": "14",
        "subcaptionFontSize": "14",
        "subcaptionFontBold": "0",
        "toolTipColor": "#ffffff",
        "toolTipBorderThickness": "0",
        "toolTipBgColor": "#000000",
        "toolTipBgAlpha": "80",
        "toolTipBorderRadius": "2",
        "toolTipPadding": "5"
      },

      "data": this.countryData
    }


    this.statsService.getTrafficGraph(this.currentUser.uid, this.article.site_url, this.article.url, this.from, this.to, this.extra).subscribe(res => {
      for (let value of res) {
        this.trafficDate.push({ 'label': value.dateTime });
        this.trafficData.push({ 'value': parseInt(value.sessions) });
        this.earnedData.push({ 'value': value.earned });


      }
    },
      err => {

      }
    );

    this.statsService.getCountryGraph(this.currentUser.uid, this.article.site_url, this.article.url, this.from, this.to).subscribe(res => {
      let i = 1;
      this.sum = 0;
      for (let value of res) {
        this.countryData.push({ 'label': i++, 'value': parseInt(value.sessions), "displayValue": value.country });
        this.sum = this.sum + parseInt(value.sessions);
      }


      for (let value of res) {
        this.countryData.push({ 'label': i++, 'value': parseInt(value.sessions), "displayValue": "" + value.country + ", " + (parseInt(value.sessions) / this.sum) * 100 + "%" });
      }
    },
      err => {
      }
    );

  }











  loadStats(uid, username) {
    console.log("Stats Loading");


  }



}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { JsonPipe } from '@angular/common';

import { Observable } from 'rxjs/Rx';
import { DATA_API_ENDPOINT } from '../Models/models';

@Injectable() // The Injectable decorator is required for dependency injection to work
export class StatsService {
  constructor(
    private http: Http
  ) { }
  getStats(_uid, _username) {
    let data = { uid: _uid, extra: _username};
    return this.http.post(DATA_API_ENDPOINT + 'api/user/sessions',data)
      .map((res: Response) => res.json());
  }

  getArticleStats(_url, _date, _article_url, _username) {

    let data = { site_url: _url, modified_date: _date, url: _article_url, username: _username };
    return this.http.post(DATA_API_ENDPOINT + 'api/user/shared/views_shares', data)
      .map((res: Response) => res.json());
  }



  getTrafficGraph(_uid, _site_url, _url, _fromDate, _toDate, _extra) {
  let data = { uid: _uid, site_url: _site_url, url: _url, fromDate: _fromDate, toDate: _toDate, extra: _extra };
  return this.http.post(DATA_API_ENDPOINT + 'api/user/graph/traffic', data)
    .map((res: Response) => res.json());
  }

  getCountryGraph(_uid, _site_url, _url, _fromDate, _toDate) {
  let data = { uid: _uid, site_url: _site_url, url: _url, fromDate: _fromDate, toDate: _toDate };
  return this.http.post(DATA_API_ENDPOINT + 'api/user/graph/country', data)
    .map((res: Response) => res.json());
  }


  get_statistics(_uid, _from, _to, _extra) {
  let fromYear = _from.toISOString();

  let from = fromYear.split('T');
  let f = from[0];
  let toDate = _to.toISOString();
  let to = toDate.split('T');

  let t = to[0];
  let data = { uid: _uid, from_date: f, to_date: t, extra: _extra };
  return this.http.post(DATA_API_ENDPOINT + 'api/user/statistics', data)
    .map((res: Response) => res.json());
}



}

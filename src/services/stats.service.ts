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


}

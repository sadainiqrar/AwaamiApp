import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { JsonPipe } from '@angular/common';

import { Observable } from 'rxjs/Rx';
import { DATA_API_ENDPOINT } from '../Models/models';

@Injectable() // The Injectable decorator is required for dependency injection to work
export class ArticleService {
  constructor(
    private http: Http
  ) { }
  getArticles(_uid, _category) {
    let data = { uid: _uid, category: null, sub_category: _category };
    return this.http.post(DATA_API_ENDPOINT + 'api/user/articles',data)
      .map((res: Response) => res.json());
  }
  insertSharedArticles(_uid, _serial) {
    var data = { uid: _uid, serial_no: _serial, copied: false, shared: true };
    return this.http.put(DATA_API_ENDPOINT + 'api/user/insert/shared_article', data)
      .map((res: Response) => res.json());
  }
}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { JsonPipe } from '@angular/common';

import { Observable } from 'rxjs/Rx';
import { DATA_API_ENDPOINT } from '../Models/models';

@Injectable() // The Injectable decorator is required for dependency injection to work
export class SourcesService {
  constructor(
    private http: Http
  ) { }
  getSources(_uid) {
    return this.http.get(DATA_API_ENDPOINT + 'api/ums/' + _uid)
      .map((res: Response) => res.json());
  }
  deleteSource(_pid, _uid) {
    let data = {  ums_id: _pid, uid: _uid }
    return this.http.post(DATA_API_ENDPOINT + 'api/ums/delete', data)
      .map((res: Response) => res.json());
  }
  addSource(_pid, _link, _uid) {
    let data = { ums_id: _pid, url: _link, uid: _uid };
    return this.http.put(DATA_API_ENDPOINT + 'api/ums/add', data)
      .map((res: Response) => res.json());
  }
  shorten(_url, _uid) {
    let data = { ums_id: _url, uid: _uid };
    return this.http.post(DATA_API_ENDPOINT + 'api/url/shorten', data)
      .map((res: Response) => res.json());
  }


 

}

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
}

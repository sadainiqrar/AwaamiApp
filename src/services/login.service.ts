import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { JsonPipe } from '@angular/common';

import { Observable } from 'rxjs/Rx';
import { DATA_API_ENDPOINT } from '../app/app.component';

@Injectable() // The Injectable decorator is required for dependency injection to work
export class LoginService {
  constructor(
    private http: Http
  ) { }
  login(_uid, _fullname) {
    let data = { uid: _uid, fullname: _fullname };
    return this.http.post(DATA_API_ENDPOINT + 'api/user/login',data)
      .map((res: Response) => res.json());
  }
}


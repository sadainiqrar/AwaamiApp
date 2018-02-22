import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { HomePage } from '../home/home';

import { NativeStorage } from '@ionic-native/native-storage';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [LoginService] 
})
export class LoginPage {
  FB_APP_ID: number = 141614143143756;
  name: string;
  id: string;
  constructor(public navCtrl: NavController, private fb: Facebook, private nativeStorage: NativeStorage, private loginService: LoginService) {
    this.fb.browserInit(this.FB_APP_ID, "v2.8");

  }
  login() {

    let nav = this.navCtrl;
    let env = this;
    this.fb.login(['public_profile', 'email', 'pages_show_list' ])
      .then((res: FacebookLoginResponse) => {
        env.fb.login(['publish_actions', 'manage_pages']).then((res: FacebookLoginResponse) => {
          let params = new Array<string>();
          if (res.status == 'connected') {
            console.log('Logged into Facebook!', res)
            env.fb.api("/me?fields=name", params)
              .then(function (user) {
                console.log(user.name);
                env.loginService.login(user.id, user.name).subscribe(res => {
                  console.log(res);
                  env.nativeStorage.remove('currentUser').then(
                    () => {
                      console.log('Cleared currentUser!');
                      env.nativeStorage.setItem('currentUser', { uid: res[0].uid, username: res[0].username, photourl: res[0].photourl, fullname: res[0].fullname })
                        .then(
                        () => {
                          console.log('Stored currentUser!');
                          nav.push(HomePage);
                        },
                        error => console.error('Error storing item', error)
                        );
                    },
                    error => console.error('Error Clearing currentUser', error)
                  );
                 
                }
                );
              })
              .then(function () {
                console.log("No user");
              }, function (error) {
                console.log(error);
              })
          }
        })
       
      }
      )
      .catch(e => console.log('Error logging into Facebook', e));


   // this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }
  

}

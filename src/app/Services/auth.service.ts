import { Injectable } from '@angular/core';
import {User} from '../Models/User';
import {Post} from '../Models/Post';
import {ProfileService} from './profile.service';
import {API_ENDPOINT} from '../constants';
import {HttpClient, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userNameS = new Subject<string>();
  user: User;
  obsTest = new Subject<User>();
  constructor(private httpClient: HttpClient,
              private profileService: ProfileService) {
    this.user =
      new User('0', '0', 0, 0, new Array<Post>(), new Array<string>(), new Array<string>());
    if (localStorage.getItem('currentUser') !== null && localStorage.getItem('currentUser') !== '') {
      this.setUser();
    }
    this.userNameS.subscribe(userName => {
      localStorage.setItem('currentUser', userName);
      this.setUser();
    });
  }
  setUser(): void {
    this.httpClient.get(API_ENDPOINT + '/' + localStorage.getItem('currentUser'))
      .subscribe(data => {
        this.user = JSON.parse(JSON.stringify(data));
        this.obsTest.next(this.user);
      });
  }

  getUser(): User{
    // @ts-ignore
    return this.user;
  }

  getUserAsync(): Subject<User>{
    return this.obsTest;
  }
  processLogin(userName: string, passwd: string): Observable<HttpResponse<any>>{
    // this.userNameS.next(userName); // TODO !!!
    return this.profileService.processLogin(userName, passwd);
  }
  register(userName: string, password: string): Promise<HttpSentEvent |
                                                HttpHeaderResponse |
                                                HttpResponse<any> |
                                                HttpProgressEvent |
                                                HttpUserEvent<any>> {
    return this.profileService.register(userName, password);
  }
}


import { Injectable } from '@angular/core';
import {User} from '../Models/User';
import {Post} from '../Models/Post';
import {ProfileService} from './profile.service';
import {API_ENDPOINT} from '../constants';
import {HttpClient, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userNameS = new Subject<string>();
  user: User;
  obsTest = new Subject<User>();
  // tslint:disable-next-line:variable-name
  private _isLoggedIn = false;
  constructor(private httpClient: HttpClient,
              private profileService: ProfileService,
              private router: Router
              ) {
    if (localStorage.getItem('token') != null){
      this._isLoggedIn = true;
    }
    // @ts-ignore
    this.user = new User();
    if (this._isLoggedIn) {
      this.setUser();
    }
    this.userNameS.subscribe(userName => {
      localStorage.setItem('currentUser', userName);
      this.setUser();
    });
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  setUser(): void {
    this.profileService.getUser(localStorage.getItem('currentUser'))
      .subscribe(data => {
        this.user = JSON.parse(JSON.stringify(data));
        console.log(this.user);
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
  processLogin(userName: string, passwd: string): void{
    this.userNameS.next(userName);
    this.profileService.processLogin(userName, passwd)
      .subscribe(data => {
        localStorage.setItem('token', data.headers.get('Authorization')?.substr('Bearer '.length) as string);
        this._isLoggedIn = true;
        this.router.navigate(['/']).then();

      });
  }
  register(userName: string, password: string): Promise<HttpSentEvent |
                                                HttpHeaderResponse |
                                                HttpResponse<any> |
                                                HttpProgressEvent |
                                                HttpUserEvent<any>> {
    return this.profileService.register(userName, password);
  }



}


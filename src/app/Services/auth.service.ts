import { Injectable } from '@angular/core';
import {User} from '../Models/User';
import {ProfileService} from './profile.service';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userNameS = new Subject<string>();
  user: User;
  obsTest = new Subject<User>();
  // tslint:disable-next-line:variable-name
  private _isLoggedIn = false;
  constructor(private profileService: ProfileService,
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
    }
    );
  }

  get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  setUser(): void {
    this.profileService.getUser(localStorage.getItem('currentUser'))
      .subscribe(data => {
        console.log('ti');
        this.user = JSON.parse(JSON.stringify(data));
        this.obsTest.next(this.user);
      },
        error => {
          if (error.status === 404){
            this.router.navigate(['/404']);
          }else if (error.status === 403){
            this.router.navigate(['/login']);
          }
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
  // tslint:disable-next-line:ban-types
  register(userName: string, password: string): Observable<Object> {
    return this.profileService.register(userName, password);
  }



}


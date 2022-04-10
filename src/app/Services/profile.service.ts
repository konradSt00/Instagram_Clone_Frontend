import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {
  HttpClient,
  HttpEvent,
  HttpHeaderResponse, HttpHeaders,
  HttpParams,
  HttpProgressEvent,
  HttpRequest,
  HttpResponse, HttpSentEvent,
  HttpUserEvent
} from '@angular/common/http';
import {API_ENDPOINT} from '../constants';
import {User} from '../Models/User';
import {AuthService} from './auth.service';
import {HttpService} from "./http.service";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private httpService: HttpService) { }

  getUser(name: string | null): Observable<HttpEvent<User>>{
    // TODO: error handling - name = null?
    const url = API_ENDPOINT + '/' + name;
    // @ts-ignore
    return this.httpService.sendHttpRequest('GET', url, this.httpService.getAuthHttpHeaders());
  }
  putFollow(user: User): void {
    const followingUsername = localStorage.getItem('currentUser');
    // @ts-ignore
    // TODO: response
    this.httpService.sendHttpRequest('PUT', API_ENDPOINT + '/' + user.username + '/' + followingUsername,
      this.httpService.getAuthHttpHeaders())
      .subscribe();
  }
  register(userName: string, password: string): // TODO: register doesnt work
    Observable<Object> {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('newUserName', new Blob([userName], {type: 'text/plain'}), 'userName');
    return this.httpService.sendHttpRequest('POST',
      API_ENDPOINT + '/user',
      this.httpService.getAuthHttpHeaders(),
      formData);
  }
  processLogin(userName: string, passwd: string): Observable<HttpResponse<any>>{
    return this.httpService.postLoginData(userName, passwd);
  }
  searchUsers(event: string): Observable<HttpEvent<Array<User>>>{
    const url = API_ENDPOINT + '/search/' + event;
    // @ts-ignore
    return this.httpService.sendHttpRequest('GET',
      url,
      this.httpService.getAuthHttpHeaders());
  }
}

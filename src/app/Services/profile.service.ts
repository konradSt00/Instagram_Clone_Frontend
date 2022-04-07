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
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('followingUser', new Blob([localStorage.getItem('currentUser')], {type: 'text/plain'}), 'userName');
    // TODO: response
    this.httpService.sendHttpRequest('PUT', API_ENDPOINT + '/' + user.username,
      this.httpService.getAuthHttpHeaders(),
      formData)
      .subscribe();
  }
  register(userName: string, password: string):
    Observable<Object> {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('newUserName', new Blob([userName], {type: 'text/plain'}), 'userName');
    return this.httpService.sendHttpRequest('POST',
      API_ENDPOINT + '/addnewuser',
      this.httpService.getAuthHttpHeaders(),
      formData);
  }
  processLogin(userName: string, passwd: string): Observable<HttpResponse<any>>{
    return this.httpService.postLoginData(userName, passwd);
  }
  searchUsers(event: string): Observable<HttpEvent<Array<User>>>{
    const url = API_ENDPOINT + '/s/' + event;
    // @ts-ignore
    return this.httpService.sendHttpRequest('GET',
      url,
      this.httpService.getAuthHttpHeaders());
  }
}

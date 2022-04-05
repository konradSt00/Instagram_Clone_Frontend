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

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private httpClient: HttpClient) { }

  getUser(name: string): Observable<User>{
    // @ts-ignore
    return this.httpClient.get(API_ENDPOINT + '/' + name);
  }
  putFollow(user: User): void {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('followingUser', new Blob([localStorage.getItem('currentUser')], {type: 'text/plain'}), 'userName');
    // TODO: response
    this.sendHttpRequest('PUT', API_ENDPOINT + '/' + user.name, formData).subscribe();
  }

  register(userName: string, password: string): Promise<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any>> {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('newUserName', new Blob([userName], {type: 'text/plain'}), 'userName');
    return this.sendHttpRequest('POST', API_ENDPOINT + '/addnewuser' , formData)
      .toPromise();
  }
  processLogin(userName: string, passwd: string): Observable<HttpResponse<any>>{
    const body = new HttpParams()
      .set(`username`, userName)
      .set(`password`, passwd);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpClient.post(API_ENDPOINT + `/login`, body.toString(), { headers, observe: 'response' });
  }

  private sendHttpRequest(type: string, url: string,
                          formData: FormData | undefined): Observable<HttpEvent<any>>{
    const params = new HttpParams();
    const options = {
      params,
      reportProgress: true,
    };
    let req;
    if (formData !== undefined) {
      req = new HttpRequest(type, url, formData, options);
    }else{
      // @ts-ignore
      req = new HttpRequest(type, url);
    }
    return this.httpClient.request(req);
  }


  searchUsers(event: string): Observable<Array<User>>{
    // @ts-ignore
    return this.httpClient.get(API_ENDPOINT + '/s/' + event);
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {API_ENDPOINT} from '../constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private httpClient: HttpClient) { }

  public sendHttpRequest(type: string,
                         url: string,
                         httpHeaders?: HttpHeaders,
                         // tslint:disable-next-line:ban-types
                         formData?: FormData): Observable<Object>{
    return this.httpClient.request(type, url,{headers: httpHeaders, observe: 'body', body: formData});

  }

  public getAuthHttpHeaders(): HttpHeaders{
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders();
    return headers.set('Authorization',  `Bearer ${token}`);
  }
  public postLoginData(userName: string, passwd: string): Observable<HttpResponse<any>>{
    const body = new HttpParams()
      .set(`username`, userName)
      .set(`password`, passwd);
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpClient.post(API_ENDPOINT + `/login`, body.toString(), { headers, observe: 'response' });
  }
}

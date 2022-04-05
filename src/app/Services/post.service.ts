import { Injectable } from '@angular/core';
import {Post} from '../Models/Post';
import {Comm} from '../Models/Comment';
import {User} from '../Models/User';
import {HttpClient, HttpEvent, HttpParams, HttpRequest} from '@angular/common/http';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {API_ENDPOINT} from '../constants';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsList: Array<Post>;
  commForm = this.formBuilder.group({});

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder, private authService: AuthService) {
    this.postsList = new Array<Post>();
    this.downloadMainWallPosts();
  }
  private downloadMainWallPosts(): void{
    this.httpClient.get(API_ENDPOINT + '/main_wall' + '/' + localStorage.getItem('currentUser'))
      .subscribe(data => {
        console.log(data);
        JSON.parse(JSON.stringify(data))
          .forEach((postInfo: any, index: number) => {
          this.postsList[index] = this.createPostFromJson(postInfo.post, postInfo.liked);
          this.addCommentFormGroup(this.postsList[index].id);
        });
      });
  }
  private createPostFromJson(post: any , liked: boolean): Post{
    const commList = post.commentList;
    return  new Post(post.id, post.likes, post.description, commList,
      post.userName, liked);
  }
  addCommentFormGroup(postId: number): void{
    if (!this.commForm.contains(postId.toString())){
      this.commForm.addControl(postId.toString(), this.formBuilder.group({comment: ''}));
    }
  }
  getPostList(): Array<Post>{
    return this.postsList;
  }

  getCommForm(): FormGroup{
    return this.commForm;
  }
  likePost(id: number): void {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('userName', new Blob([localStorage.getItem('currentUser')], {type: 'text/plain'}), 'userName');
    // TODO: response
    this.sendHttpRequest('PUT', API_ENDPOINT + '/p/' + id.toString(), formData).subscribe(data => console.log(data));
    // tslint:disable-next-line:no-shadowed-variable
    const post = this.postsList.filter(post => post.id === id)[0];
    if (post.liked === true) {
      post.liked = false;
      post.likes --;
    }
    else{
      post.liked = true;
      post.likes ++;
    }
  }
  // tslint:disable-next-line:ban-types
  getSinglePost(postId: string): Observable<Object> {
    return this.httpClient.get(API_ENDPOINT + '/pi/' + localStorage.getItem('currentUser') + '/' + postId);
  }
  deleteComment(post: Post, commID: number): void {
    post.commentsList = post.commentsList.filter(comment => comment.id !== commID);
    // TODO: response
    // @ts-ignore
    this.sendHttpRequest('DELETE', API_ENDPOINT + '/p/' + post.id + '/' + commID).subscribe();
  }
  sendComment(id: number, post: Post, commForm: AbstractControl | null): void {
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('userName', new Blob([localStorage.getItem('currentUser')], {type: 'text/plain'}), 'userName');
    // @ts-ignore
    const inputValue = commForm.get('comment').value;
    if (inputValue != null && inputValue !== ''){
      formData.append('comment',
        new Blob([inputValue], {type: 'text/plain'}), 'comment');
      const userName = localStorage.getItem('currentUser');
      if (userName !== null){
        const newComment =
          new Comm(-1, inputValue, userName, new Date());
        post.commentsList[post.commentsList.length] = newComment;
        this.sendHttpRequest('POST', API_ENDPOINT + '/p/' + id.toString(), formData)
          .subscribe(o => {
            const data = JSON.parse(JSON.stringify(o));
            if (data.body !== undefined) {
              newComment.id = data.body;
            }
          });

        // @ts-ignore
        commForm.get('comment').setValue('');
      }
    }
  }
  sendHttpRequest(type: string, url: string,
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

}

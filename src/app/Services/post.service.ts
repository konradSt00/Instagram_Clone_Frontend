import { Injectable } from '@angular/core';
import {Post} from '../Models/Post';
import {Comm} from '../Models/Comment';
import {User} from '../Models/User';
import {HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {AbstractControl, FormBuilder, FormGroup} from '@angular/forms';
import {API_ENDPOINT} from '../constants';
import {Observable} from 'rxjs';
import {AuthService} from './auth.service';
import {HttpService} from './http.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  postsList = new Array();
  commForm = this.formBuilder.group({});

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private httpService: HttpService,
              private router: Router) {
  }
  private downloadMainWallPosts(): void{
    this.httpService.sendHttpRequest('GET',
      API_ENDPOINT + '/main_wall' + '/' + localStorage.getItem('currentUser'),
      this.httpService.getAuthHttpHeaders())
        .subscribe(data => {
          JSON.parse(JSON.stringify(data))
            .forEach((postInfo: any, index: number) => {
            this.postsList[index] = this.createPostFromJson(postInfo.post, postInfo.liked);
            this.addCommentFormGroup(this.postsList[index].id);
          });
        },
          error => {
            if (error.status === 404){
              this.router.navigate(['/404']);
            }else if (error.status === 403){
              this.router.navigate(['/login']);
            }
          });
  }

  // tslint:disable-next-line:ban-types
  getSinglePost(postId: string): Observable<Object> {
    return this.httpService.sendHttpRequest('GET',
      API_ENDPOINT + '/pi/' + localStorage.getItem('currentUser') + '/' + postId,
      this.httpService.getAuthHttpHeaders());
  }

  likePost(id: number): void {
    // @ts-ignore
    // TODO: response
    this.httpService.sendHttpRequest('PUT',
      API_ENDPOINT + '/p/' + id.toString() + '/' + localStorage.getItem('currentUser'),
      this.httpService.getAuthHttpHeaders())
        .subscribe(data => console.log(data));
    // tslint:disable-next-line:no-shadowed-variable
    const post = this.postsList.filter(post => post.id === id)[0];
    if (post !== undefined && post.liked === true) {
      post.liked = false;
      post.likes --;
    }
    else if (post !== undefined){
      post.liked = true;
      post.likes ++;
    }
  }

  deleteComment(post: Post, commID: number): void {
    post.commentsList = post.commentsList.filter(comment => comment.id !== commID);
    this.httpService.sendHttpRequest('DELETE',
      API_ENDPOINT + '/p/' + post.id + '/' + commID,
      this.httpService.getAuthHttpHeaders())
      .subscribe();
  }
  uploadNewPost(formData: FormData): void{
    this.httpService.sendHttpRequest('POST', 'http://localhost:8080/newPost', this.httpService.getAuthHttpHeaders(), formData)
      .subscribe();
  }
  sendComment(id: number, post: Post, commForm: AbstractControl | null ): void {
    const formData: FormData = new FormData(); // TODO: to function
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
        this.httpService.sendHttpRequest('POST', API_ENDPOINT + '/p/' + id.toString(), this.httpService.getAuthHttpHeaders(), formData)
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
    if (this.postsList.length === 0){
      this.postsList = new Array<Post>();
      this.downloadMainWallPosts();
    }
    return this.postsList;
  }

  getCommForm(): FormGroup{
    return this.commForm;
  }

}

import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient, HttpClientModule, HttpEvent, HttpHeaders, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Post} from '../../Models/Post';
import {Comm} from '../../Models/Comment';
import {User} from '../../Models/User';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {PostService} from '../../Services/post.service';
import {AuthService} from '../../Services/auth.service';
import {API_ENDPOINT, PHOTO_API_ENDPOINT} from '../../constants';
import {Router} from '@angular/router';
@Component({
  selector: 'app-main-wall',
  templateUrl: './main-wall.component.html',
  styleUrls: ['./main-wall.component.css']
})
export class MainWallComponent implements OnInit {
  postsList: Array<Post>;
  newPostWindowOpened: boolean;
  commForm: FormGroup;
  photoApiUrl: string;
  constructor(private postService: PostService,
              private authService: AuthService,
              private router: Router) {
    this.postsList = postService.getPostList();
    this.commForm = postService.getCommForm();
    this.newPostWindowOpened = false;
    this.photoApiUrl = PHOTO_API_ENDPOINT;
  }

  ngOnInit(): void {
  }
  onSubmit(id: number): void{
    this.postService.sendComment(id, this.postsList.filter(post => post.id === id)[0], this.commForm.get(id.toString()));
  }

  deleteResource(postID: number, commentID: number): void {
    this.postService.deleteComment(this.postsList.filter(post => post.id === postID)[0], commentID);
  }

  like(id: number): void {
    this.postService.likePost(id);
    this.postsList = this.postsList;
  }

  goToProfile(userName: string): void {
    this.router.navigate(['/' + userName]).then();
  }
  postDetailsView(postId: string): void{
    this.router.navigate(['/p/' + postId]).then();
  }
}

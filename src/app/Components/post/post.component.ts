import {Component, HostListener, OnChanges, OnInit} from '@angular/core';
import {Post} from '../../Models/Post';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {API_ENDPOINT, PHOTO_API_ENDPOINT} from '../../constants';
import {toNumbers} from '@angular/compiler-cli/src/diagnostics/typescript_version';
import {Comm} from '../../Models/Comment';
import {PostService} from '../../Services/post.service';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../Services/auth.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  constructor(private router: Router,
              private httpClient: HttpClient,
              private postService: PostService,
              private formBuilder: FormBuilder,
              ) {
    this.photoApiUrl = PHOTO_API_ENDPOINT;
    this.post = new Post(-1, -1, '', new Array<Comm>(), '', false);
    this.getPost(this.router.url.split('/')[this.router.url.split('/').length - 1]);
    this.router.events.subscribe(() =>  {
      if (this.router.url.startsWith('/pd/')){
        this.getPost(this.router.url.split('/')[this.router.url.split('/').length - 1]);
      }
    });
  }
  post: Post;
  photoApiUrl: string;
  liked = false;
  commForm = this.formBuilder.group({
    comment: ''
  });

  ngOnInit(): void {
  }
  getPost(postId: string): void{
    if (this.post.id.toString() !== postId ){
      this.post.id = Number(postId);
      this.postService.getSinglePost(postId)
        .subscribe(data => {
          const postInfo = JSON.parse(JSON.stringify(data));
          const commList = postInfo.post.commentList;
          this.post = new Post(postInfo.post.id, postInfo.post.likes, postInfo.post.description, commList,
            postInfo.post.userName, postInfo.liked);

        });
    }
  }
  goToProfile(userName: string): void {
    this.router.navigate(['/' + userName]);
  }
  onSubmit(): void{
    this.postService.sendComment(this.post.id, this.post, this.commForm);
  }

  deleteResource(postID: number, commentID: number): void {
    this.postService.deleteComment(this.post, commentID);
  }
  like(id: number): void {
    this.postService.likePost(id);
    if(this.post.liked === true){
      this.post.likes --;
    }else{
      this.post.likes++;
    }
    this.post.liked = !this.post.liked;

  }
  inputFocus(): void {
    // @ts-ignore
    document.getElementById('commentInput').focus();
  }


}

import {Component, HostListener, OnInit} from '@angular/core';
import {HttpClient, HttpEvent, HttpParams, HttpRequest} from '@angular/common/http';
import {User} from '../../Models/User';
import {Post} from '../../Models/Post';
import {Router} from '@angular/router';
import {AuthService} from '../../Services/auth.service';
import {API_ENDPOINT, PHOTO_API_ENDPOINT} from '../../constants';
import {Observable} from 'rxjs';
import {ProfileService} from '../../Services/profile.service';
import {delay} from 'rxjs/operators';
import {Location} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  constructor(private httpClient: HttpClient,
              private profileService: ProfileService,
              router: Router,
              private authService: AuthService,
              private location: Location) {
    this.router = router;
    this.followed = false;
    this.loggedUser = this.authService.getUser();
    this.user = this.authService.getUser();
    this.setLoggedUser();
    this.user = new User('', '', 0, 0, new Array(), new Array<string>(), new Array<string>());
    this.photoApiUrl = PHOTO_API_ENDPOINT;
  }
  user: User;
  router: Router;
  loggedUser: User;
  followed: boolean;
  photoApiUrl: string;
  postDetailed = -1;
  postDetails = false;
  @HostListener('document:keydown', ['$event'])
  // tslint:disable-next-line:typedef
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.postDetailed !== -1){
      if (event.key === 'ArrowLeft'){
        this.postDetailed = this.user.posts[this.getPrevPost(this.postDetailed)].id;
        this.postDetail(this.postDetailed);
      }else if (event.key === 'ArrowRight'){
        this.postDetailed = this.user.posts[this.getNextPost(this.postDetailed)].id;
        this.postDetail(this.postDetailed);
      }else if (event.key === 'Escape'){
        this.closePostDetailsWindow();
      }
    }
  }
  setLoggedUser(): void{
    this.authService.getUserAsync().subscribe(user => {
      console.log(user);
      this.loggedUser = user;
      this.user = user;
      this.followed = this.isFollowed(this.user);
    });
  }
  getPostIndex(postId: number): number{
    let idx = 0;
    this.user.posts.forEach((post, index: number) => {
      if (post.id === postId){
        idx = index;
      }
    });
    return idx;
  }
  getPrevPost(currPostId: number): number{
    let currPostIdx = this.getPostIndex(currPostId);
    if (currPostIdx > 0){
      currPostIdx --;
    }
    return currPostIdx;
  }
  getNextPost(currPostId: number): number{
    let currPostIdx = this.getPostIndex(currPostId);
    if (currPostIdx < this.user.posts.length - 1){
      currPostIdx ++;
    }
    return currPostIdx;
  }
  ngOnInit(): void {
    let name = this.router.url.substr(1);
    if (name === 'profile'){
      const n = localStorage.getItem('currentUser');
      if (n !== null) {
       name =  n;
      }else{
        name = '';
      }
      this.user = this.loggedUser;
    }
    this.profileService.getUser(name)
      .subscribe(data => {
          const user = JSON.parse(JSON.stringify(data));
          const postArray = new Array<Post>();
          user.posts.forEach((post: Post, index: number) => postArray[index] = post);
          this.user = user;
          this.followed = this.isFollowed(this.user);
      },
        error => {
        if (error.status === 404){
          this.router.navigate(['/404']);
        }
      }
      );
  }
  follow(): void {
    if (!this.isFollowed(this.user)){
      this.user.numOfFollowers += 1;
      this.loggedUser.followings[this.loggedUser.followings.length] = this.user.username;
      this.followed = true;
    }else{
      this.user.numOfFollowers -= 1;
      this.loggedUser.followings = this.loggedUser.followings.filter(name => name !== this.user.username);
      this.followed = false;
    }
    this.profileService.putFollow(this.user);
  }
  isFollowed(user: User): boolean {
    console.log(this.loggedUser);
    if (this.loggedUser.followings.filter(userName => userName === user.username ).length > 0){
      return true;
    }
    return false;
  }
  postDetail(id: number): void {
    this.postDetailed = id;
    this.router.navigate(['/pd/' + id]).then(() =>  this.location.replaceState('/p/' + id));
    this.postDetails = true;
  }
  closePostDetailsWindow(): void{
    this.postDetails = false;
    this.location.replaceState('/' + this.user.username);
  }

}

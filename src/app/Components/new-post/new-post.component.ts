import { Component, OnInit } from '@angular/core';
import {HttpClient, HttpParams, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from '../../Services/auth.service';
import {PostService} from '../../Services/post.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  fileToUpload: File | null = null;
  fileLoaded: boolean;
  nextPageLoaded = false;
  reader: FileReader | undefined;
  constructor(private postService: PostService) {
    this.fileLoaded = false;
  }

  ngOnInit(): void {
  }
  closeWindow(): void{
    console.log('Closed');
  }
  uploadFile(event: Event, image: HTMLImageElement): void{
    // @ts-ignore
    this.fileToUpload = event.target.files[0];
    // tslint:disable-next-line:prefer-const
    const reader = new FileReader();
    // tslint:disable-next-line:only-arrow-functions typedef
    reader.onload = function(e){
      // @ts-ignore
      // tslint:disable-next-line:no-unused-expression label-position
      if (e.target != null && image.src != null && typeof e.target.result === 'string') {
        image.src = e.target.result;
      }
    };
    // @ts-ignore
    reader.readAsDataURL(this.fileToUpload);
    this.fileLoaded = true;

  }
  nextPage(): void {
    if (this.fileLoaded === true) {
      this.nextPageLoaded = true;
    }
  }

  prevPage(): void {
    if (this.nextPageLoaded === true) {
      this.nextPageLoaded = false;
    }
  }
  uploadPhoto(textArea: HTMLTextAreaElement): void{
    // tslint:disable-next-line:label-position
    const formData: FormData = new FormData();
    // @ts-ignore
    formData.append('userName', new Blob([localStorage.getItem('currentUser')], {type: 'text/plain'}), 'userName');
    // @ts-ignore
    formData.append('photo', this.fileToUpload, 'newPhoto');
    // @ts-ignore
    formData.append('description', new Blob([textArea?.value], {type: 'text/plain'}), 'postDescription');
    this.postService.uploadNewPost(formData);
    window.location.reload();
  }

}

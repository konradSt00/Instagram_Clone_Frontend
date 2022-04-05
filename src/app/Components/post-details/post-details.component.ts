import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  redirectAndReload(url: string): void{
    this.router.navigate([url]).then(() => window.location.reload());
  }
}

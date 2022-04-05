import {Component, ElementRef, HostListener, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../../Models/User';
import {ProfileService} from '../../Services/profile.service';
import {resolve} from '@angular/compiler-cli/src/ngtsc/file_system';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  newPostWindowOpened = false;
  usersList = Array<User>();
  quantity = '';
  resultsShown = false;
  constructor(private router: Router,
              private profileService: ProfileService,
              private elementRef: ElementRef) {

  }
  ngOnInit(): void {
  }
  @HostListener('document:keydown', ['$event'])
  // tslint:disable-next-line:typedef
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape'){
      this.closeNewPostWindow();
    }
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      // clicked outside => close dropdown list
      this.resultsShown = false;
    }
  }
  public newPostWindow(): void{
    this.newPostWindowOpened = true;
  }
  redirectAndReload(url: string): void{
    this.router.navigate([url]).then(() => window.location.reload());
  }

  closeNewPostWindow(): void {
    this.newPostWindowOpened = false;
  }

  searchUsers(event: string): void {
    this.usersList = new Array<User>();
    if (event !== '' && /^[a-zA-Z]+$/.test(event)){
      // tslint:disable-next-line:no-shadowed-variable
      this.profileService.searchUsers(event).toPromise().then( resolve =>
        this.usersList = JSON.parse(JSON.stringify(resolve)));
    }
  }

  moveToUserProfile(name: string): void {
    // @ts-ignore
    this.router.navigate(['/' + name]).then(() => window.location.reload());
  }

  showResults(): void {
    this.resultsShown = true;
  }

  closeResults(): void {
    this.resultsShown = false;
  }
}

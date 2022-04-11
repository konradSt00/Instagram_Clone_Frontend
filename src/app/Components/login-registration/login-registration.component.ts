import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../Services/auth.service';
import {Router} from '@angular/router';
import {ProfileService} from '../../Services/profile.service';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.css']
})
export class LoginRegistrationComponent implements OnInit {
  registration = false;
  userNameInformationShown = false;
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.checkLocation();
  }
  checkLocation(): void{
    const x = location.pathname.split('/');
    if (x[x.length - 1] === 'login'){
      this.registration = false;
    }else{
      this.registration = true;
    }
  }

  showPsw(password1: HTMLInputElement, showBtn: HTMLButtonElement): void {
    let text = '';
    if (password1 instanceof HTMLInputElement && password1.type === 'password') {
      password1.type = 'text';
      text = 'Hide';
    } else if (password1 instanceof HTMLInputElement) {
      password1.type = 'password';
      text = 'Show';
    }
    // @ts-ignore
    showBtn.setAttribute('content', 'test content');
    // @ts-ignore
    showBtn.setAttribute('class', 'btn');
    // @ts-ignore
    showBtn.textContent = text;
  }

  submit(username: HTMLInputElement, password1: HTMLInputElement, password2: HTMLInputElement): void {
    if (this.registration === true){
      this.register(username, password1, password2);
    }else{
      this.login(username, password1);
    }
  }
  private login(username: HTMLInputElement, password: HTMLInputElement): void{
    if (username instanceof HTMLInputElement && password instanceof HTMLInputElement){
      this.authService.processLogin(username.value, password.value);
    }
  }
  private register(username: HTMLInputElement, password: HTMLInputElement, passwordRep: HTMLInputElement): void{
    if (username instanceof HTMLInputElement &&
      password instanceof HTMLInputElement &&
      passwordRep instanceof HTMLInputElement
        ){
      this.authService.register(username.value, password.value).subscribe(response => {
        alert('Registered!');
        this.login(username, password);
        }, error => {
          if (error.status === 409){
            this.userNameInformationShown = true;
          }
      });
    }

  }
  moveLR(): void{
    this.registration = !this.registration;
    if (!this.registration){
      this.router.navigate(['/login']).then();
    }
    else {
      this.router.navigate(['/registration']).then();
    }
  }
  hideInformations(): void{
    this.userNameInformationShown = false;
  }
}

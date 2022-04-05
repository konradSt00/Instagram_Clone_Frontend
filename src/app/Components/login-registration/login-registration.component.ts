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
  showPsw(): void {
    const x = document.getElementById('passwInput1');
    const btn = document.getElementById('showPsw');
    let text = '';
    if (x instanceof HTMLInputElement && x.type === 'password') {
      x.type = 'text';
      text = 'Hide';
    } else if (x instanceof HTMLInputElement) {
      x.type = 'password';
      text = 'Show';
    }
    // @ts-ignore
    btn.setAttribute('content', 'test content');
    // @ts-ignore
    btn.setAttribute('class', 'btn');
    // @ts-ignore
    btn.textContent = text;
  }

  submit(): void {
    if (this.registration === true){
      this.register();
    }else{
      this.login();
    }
  }
  private login(): void{
    const loginInput = document.getElementById('userName');
    const passwd = document.getElementById('passwInput1');
    if (loginInput instanceof HTMLInputElement && passwd instanceof HTMLInputElement){
      this.authService.processLogin(loginInput.value, passwd.value)
        .subscribe(data => localStorage.setItem('token', data.headers.get('Authorization')?.substr('Bearer '.length) as string));
      // this.router.navigate(['/']);
    }
  }
  private register(): void{
    const loginInput = document.getElementById('userName');
    const passwd = document.getElementById('passwInput1');
    const rPasswd = document.getElementById('passwInput2');
    if (loginInput instanceof HTMLInputElement &&
        passwd instanceof HTMLInputElement &&
        rPasswd instanceof HTMLInputElement
        ){
      this.authService.register(loginInput.value, passwd.value).then(response => {
        alert('Registered!');
        this.login();
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

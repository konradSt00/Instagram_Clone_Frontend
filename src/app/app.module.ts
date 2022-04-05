import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainWallComponent } from './Components/main-wall/main-wall.component';
import {HttpClientModule} from '@angular/common/http';
import { ProfileComponent } from './Components/profile/profile.component';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { NewPostComponent } from './Components/new-post/new-post.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PostService} from './Services/post.service';
import {AuthService} from './Services/auth.service';
import {ProfileService} from './Services/profile.service';
import { PostComponent } from './Components/post/post.component';
import { PostDetailsComponent } from './Components/post-details/post-details.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { LoginRegistrationComponent } from './Components/login-registration/login-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    NotFoundComponent,
    NewPostComponent,
    PostComponent,
    PostDetailsComponent,
    NavBarComponent,
    LoginRegistrationComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [PostService, AuthService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }

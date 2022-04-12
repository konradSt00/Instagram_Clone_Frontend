import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NotFoundComponent} from '../not-found/not-found.component';
import {NewPostComponent} from '../new-post/new-post.component';
import {PostComponent} from '../post/post.component';
import {PostDetailsComponent} from '../post-details/post-details.component';
import {NavBarComponent} from '../nav-bar/nav-bar.component';
import {LoginRegistrationComponent} from '../login-registration/login-registration.component';
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule, routingComponents} from "../../app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    routingComponents,
    NotFoundComponent,
    NewPostComponent,
    PostComponent,
    PostDetailsComponent,
    NavBarComponent,
    LoginRegistrationComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ComponentsModule { }

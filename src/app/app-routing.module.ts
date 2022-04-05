import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProfileComponent} from './Components/profile/profile.component';
import {MainWallComponent} from './Components/main-wall/main-wall.component';
import {NotFoundComponent} from './Components/not-found/not-found.component';
import {PostDetailsComponent} from './Components/post-details/post-details.component';
import {LoginRegistrationComponent} from './Components/login-registration/login-registration.component';
import {AuthGuard} from './Guards/auth.guard';

const routes: Routes = [
  { path: '', component: MainWallComponent,  canActivate: [AuthGuard] },
  { path: '404', component: NotFoundComponent},
  { path: 'login', component: LoginRegistrationComponent},
  { path: 'registration', component: LoginRegistrationComponent},
  { path: 'p/:id', component: PostDetailsComponent },
  { path: '**', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [MainWallComponent, ProfileComponent, NotFoundComponent, LoginRegistrationComponent];

import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {PostService} from './Services/post.service';
import {AuthService} from './Services/auth.service';
import {ProfileService} from './Services/profile.service';
import {ComponentsModule} from './Components/components/components.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
    imports: [
        ComponentsModule,
        RouterModule
    ],
  providers: [PostService, AuthService, ProfileService],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {LoginComponent} from './login';
import {HomeComponent} from './home';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import {  ErrorInterceptor } from './_helpers/error.interceptor';
import { ModalModule } from './_models';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    ModalModule
    
  ],
  providers: [  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },{ provide: Window, useValue: window }],
  bootstrap: [AppComponent],
  
})
export class AppModule { }

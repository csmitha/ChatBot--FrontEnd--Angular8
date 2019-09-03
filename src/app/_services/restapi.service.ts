import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { User } from './user';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { User } from '../_models';
import { ChatHistory } from '../_models';


import { map } from 'rxjs/operators';



@Injectable({ providedIn: 'root' })
export class RestapiService {
  

  // Define API
  apiURL = 'http://localhost:9000';

  constructor(private http: HttpClient) {
  
   }

  /*========================================
    CRUD Methods for consuming RESTful API
  =========================================*/

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  // HttpClient API get() method => Fetch Users list
  getUsers(): Observable<User> {
    return this.http.get<User>(this.apiURL + '/Users')
    .pipe(
      retry(1),
      catchError(this.handleError)
    )
  }

 // HttpClient API POST() method => Register New User
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURL + '/registerUser', JSON.stringify(user), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError)
    )    
  } 

  
 

  // HttpClient API GET() method => Login existing User
  login(username,password): Observable<User> {
    return this.http.get<User>(this.apiURL + '/loginUser/' + username+"/"+password)
    .pipe(map(user => {      
      return user;
     }));
  } 

  getUserChatHistory(username): Observable<ChatHistory[]> {
    return this.http.get<ChatHistory[]>(this.apiURL + '/chatHistory/' + username)
    .pipe(map(history => {      
      return history;
     }), retry(1),
     catchError(this.handleError));
  } 




  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     window.alert(errorMessage);
     return throwError(errorMessage);
  }

}

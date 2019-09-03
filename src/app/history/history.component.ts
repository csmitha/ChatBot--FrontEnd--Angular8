import { Component, OnInit,Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AlertService, RestapiService, DataService } from '../_services';
import {ChatHistory,User} from '../_models'
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
@Component({ templateUrl: 'history.component.html', styleUrls: ['./history.component.css'] })
export class HistoryComponent implements OnInit {
    registerForm: FormGroup;
    userName: String;
    loading = false;
    submitted = false;
    historyList: ChatHistory[];

    constructor(
        private router: Router,
        private restapiService: RestapiService,
        private alertService: AlertService,
        private dataService: DataService ,
        private route: ActivatedRoute     
    ) {// redirect to home if already logged in
        route.queryParams.subscribe(
            data => { console.log(data),this.userName = data['userName']})
        }
    

    ngOnInit() {
       // this.currentUser = this.dataService.user;
       // console.log(" this.currentUser "+this.currentUser)
       // console.log("this.currentUser.username:: "+this.currentUser.username)
        this.getChatHistory(this.userName);
    }

    getChatHistory(username) {
        this.submitted = true;
        this.alertService.clear();
        this.loading = true;
        this.historyList

        this.restapiService.getUserChatHistory(username)
            .pipe(first())
            .subscribe(
                data => {
                    if (data) {
                        console.log(data);
                        this.historyList =data;
                    } else {
                        const error = "Hisotry not found for user";
                        return throwError(error);
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}

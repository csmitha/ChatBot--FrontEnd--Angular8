import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, RestapiService, DataService } from '../_services';
import { User } from '../_services/user';
import { throwError } from 'rxjs';


@Injectable({ providedIn: 'root' })
@Component({ templateUrl: './login.component.html', styleUrls: ['./login.component.css'] })

export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    user: User;
    ;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private restapiService: RestapiService,
        private alertService: AlertService,
        private dataService: DataService
    ) {
        // redirect to home if already logged in
        if (this.dataService.user) {
            this.router.navigate(['/home']);
        }

    }
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    }



    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;

        this.restapiService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(

                data => {

                    if (data) {
                        console.log(data);

                        this.dataService.user = data;
                        this.router.navigate(['/home']);
                    } else {

                        const error = "Invalid User - Please click on register";
                        return throwError(error);

                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });


    }
}

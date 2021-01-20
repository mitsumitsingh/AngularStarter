import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

    signUpForm: FormGroup;
    loading: boolean;

    constructor(private router: Router,
        private titleService: Title,
        private notificationService: NotificationService,
        private authenticationService: AuthenticationService) {
    }

    ngOnInit() {
        this.titleService.setTitle('Aacharya Consultant - signUp');
        this.authenticationService.logout();
        
        this.signUpForm = new FormGroup({
          name : new FormControl('', [Validators.required, Validators.minLength(3)]),
          email: new FormControl('', [Validators.required, Validators.email]),
          password: new FormControl('', [Validators.required, Validators.minLength(6)]),
          role: new FormControl('')
      });
    }

    signUp() {
        const email = this.signUpForm.get('email').value;
        const password = this.signUpForm.get('password').value;
        const name = this.signUpForm.get('name').value;
        const role = this.signUpForm.get('role').value ? this.signUpForm.get('role').value : ['ROLE_USER'];
        
        this.loading = true;
        this.authenticationService
            .signUp(name, email.toLowerCase(), password, role)
            .subscribe(
                data => {
                    this.router.navigate(['/']);
                },
                error => {
                    this.notificationService.openSnackBar(error.error.error + "! Please Provide a valid Credentials.");
                    this.loading = false;
                }
            );
    }

    resetPassword() {
        this.router.navigate(['/auth/password-reset-request']);
    }

    login(){
        this.router.navigate(['/auth/login']);
    }

}

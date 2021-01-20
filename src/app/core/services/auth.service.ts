import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import 'rxjs/add/operator/delay';

import { environment } from '../../../environments/environment';
import { of, EMPTY } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private http: HttpClient,
        @Inject('LOCALSTORAGE') private localStorage: Storage) {
    }

    signUp(name: string, email: string, password: any, role : any) {
        return this.http.post<any>(`${environment.apiUrl}/auth/signup`, { email, password, name, role })
        .pipe(map(response => {
            console.log(response);
            if(response['message']){
                return true;
            }else{
                throw new Error('SignIn Failed.');
            }
           
        }));
    }

    login(email: string, password: string) {

        return this.http.post<any>(`${environment.apiUrl}/auth/signin`, { email, password })
            .pipe(map(response => {
               // store user details and jwt token in local storage to keep user logged in between page refreshes
                if(jwt_decode(response['accessToken'])){
                    const decodedToken = jwt_decode(response['accessToken']);

                    this.localStorage.setItem('currentUser', JSON.stringify({
                        token: response['accessToken'],
                        roles : response['roles'],
                        email: response['email'],
                        id: response['id'],
                        alias: response['email'].split('@')[0],
                        expiration: moment().add(1, 'days').toDate(),
                        fullName: response['name'],
                        isAdmin : response.roles.includes("ROLE_ADMIN")
                    }));
                    return true;
                }else{
                    throw new Error('Valid token not returned');
                }
               
            }));
    }

    logout(): void {
        this.localStorage.removeItem('currentUser');
    }

    getCurrentUser(): any {
        return JSON.parse(this.localStorage.getItem('currentUser'));
    }

    passwordResetRequest(email: string) {
        return of(true).delay(1000);
    }

    changePassword(email: string, currentPwd: string, newPwd: string) {
        return this.http.post<any>(`${environment.apiUrl}/auth/changePassword`, { email, currentPwd, newPwd })
        .pipe(map(response => {
            if(response['message']){
                return true;
            }else{
                throw new Error('Unable to reset the password.');
            }
            
        }));
    }

    passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
        return of(true).delay(1000);
    }
}

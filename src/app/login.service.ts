import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HmacSHA256 } from 'crypto-js';
import { parse as HexParse } from 'crypto-js/enc-hex';

type LoginPreResponse = {
  salt_hex: string;
  login_request_token: string;
};
type LoginResponse = {
  code: number;
  message: string;
};

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  public hasLoginCookie(): boolean {
    return this.checkHttpOnlyCookieExists('adm-token');
  }

  public isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      if (this.hasLoginCookie()) {
        this.testLoginPing().subscribe((result) => {
          observer.next(result);
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  checkHttpOnlyCookieExists(cookieName: string): boolean {
    const tmpTimeMs = new Date().getTime() + 1000;
    const tmpTime = new Date(tmpTimeMs).toUTCString();
    document.cookie = `${cookieName}=1; expires=${tmpTime}; path=/`;
    return document.cookie.indexOf(cookieName) === -1;
  }

  testLoginPing(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http
        .get('/api/v1/authping', {
          observe: 'response',
        })
        .subscribe((response) => {
          const result = response.status === 200;
          observer.next(result);
          observer.complete();
        })
        
    });
  }

  requestLogin(username: string, password: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.http
        .post<LoginPreResponse>('/api/v1/login/pre', {
          username: username,
        })
        .subscribe((response) => {
          this.http
            .post<LoginResponse>('/api/v1/login', {
              login_request_token: response.login_request_token,
              login_hmac_hex: this.getLoginHmacHex(
                response.login_request_token,
                response.salt_hex,
                password
              ),
            })
            .subscribe((response) => {
              observer.next(response.code === 0);
              observer.complete();
            });
        });
    });
  }

  getLoginHmacHex(
    login_request_token: string,
    saltHex: string,
    password: string
  ): string {
    const salt = HexParse(saltHex);
    const saltPassword = HmacSHA256(password, salt);
    return HmacSHA256(login_request_token, saltPassword).toString();
  }
}

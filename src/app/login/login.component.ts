import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  passwordError = false;

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  startLogin() {
    this.loginService.isLoggedIn().subscribe((result) => {
      if (result) {
        this.redirect();
      } else {
        // stay in login page
      }
    });
  }

  login() {
    this.loginService
      .requestLogin(this.username, this.password)
      .subscribe(([loginSuccess, message]) => {
        if (loginSuccess) {
          this.redirect();
        } else {
          this.passwordError = true;
          window.alert("password and username don't match"); //TODO: use snackbar
        }
      });
  }

  redirect() {
    const redirectTo = this.route.snapshot.queryParams['redirect'];
    if (redirectTo === undefined || redirectTo === '/login') {
      this.router.navigate(['/overview']);
      return;
    }
    this.router.navigate([redirectTo]);
  }

  ngOnInit() {
    this.startLogin();
  }
}

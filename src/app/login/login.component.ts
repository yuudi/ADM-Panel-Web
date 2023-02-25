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
        // this.login();
      }
    });
  }

  login() {
    this.loginService
      .requestLogin(this.username, this.password)
      .subscribe((result) => {
        if (result) {
          this.redirect();
        }
      });
  }

  redirect() {
    const redirectTo =
      this.route.snapshot.queryParams['redirect'] || '/overview';
    this.router.navigate([redirectTo]);
  }

  ngOnInit() {
    this.startLogin();
  }
}

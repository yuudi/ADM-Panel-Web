import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ADM-Panel-Web';

  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if current url is login page.
    if (this.router.url !== '/login') {
      // Check if user is already logged in.
      this.loginService.isLoggedIn().subscribe((result) => {
        if (result) {
          // Stay in current page.
        } else {
          // Redirect to login page.
          const currentPath = this.router.url;
          this.router.navigate(['/login'], {
            queryParams: { redirect: currentPath },
          });
        }
      });
    }
  }
}

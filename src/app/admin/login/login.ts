import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { tap } from 'rxjs';
import { InputAutoFocus } from '../../../directives/input-auto-focus';
import { PathEnum } from '../../../enums/path-enum';
import { AuthService } from '../../../services/auth.service';
import { SessionService } from '../../../services/session-service';
import { Credentials } from '../../../shared/interfaces/Credentials';
import { Notifications } from '../../../shared/interfaces/Notifications';
import { Token } from '../../../shared/interfaces/Token';

@Component({
	selector: 'admin-login-page',
	imports: [
    CommonModule, 
    FormsModule, 
    InputAutoFocus
  ],
	templateUrl: './login.html'
})

export class AdminLogin {
  @ViewChild('loginForm') loginForm!: NgForm;
  @ViewChild('unInput') unInputRef!: ElementRef;

  protected path: string = PathEnum.Login;
  protected cred: Credentials = { username: '', password: '' };
  protected errorCode: number = 0;
  protected notifications: Notifications = {
    loadingMsg: '',
    successMsg: '',
    errorMsg: ''
  }

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate([PathEnum.DB]);
    }
  }

  onSubmit(formValue: Credentials) {
    this.authService.login(formValue).pipe(
      tap(() => this.notifications.loadingMsg = 'Submitting...')
    ).subscribe(
      {
        next: (v: Token) => {
          this.sessionService.setItem(this.cred.username, v);
          this.notifications.loadingMsg = '';
          this.notifications.successMsg = 'Successful';
          this.router.navigate([PathEnum.DB]);
        },
        error: (e: HttpErrorResponse ) => {
          this.sessionService.removeItem('token');
          this.loginForm.reset();
          this.notifications.loadingMsg = '';
          this.notifications.errorMsg = e.error['message'];
          this.errorCode = e.status;
          this.unInputRef.nativeElement.focus();
          // this.router.navigate(
          //   ['/admin/login'],
          //   { state: { message: e.error, code: e.status } }
          // );
        },
        complete: () => null
      }
    );
  }

  navigateToTargetRoute(targetRoute: string, data: any) {
    const navigationExtras: NavigationExtras = {
      state: {
        message: data.message,
        code: data.code
      }
    };
    this.router.navigate([targetRoute], navigationExtras);

    // if (this.router.url.includes(targetRoute)) {
    //   this.reloadCurrentRoute(navigationExtras);
    // } else {
    //   this.router.navigate([targetRoute], navigationExtras);
    // }
  }
  
  reloadCurrentRoute(navigationExtras: NavigationExtras): void {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([this.router.url], navigationExtras);
    });
  }
}

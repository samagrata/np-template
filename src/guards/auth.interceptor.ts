import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const incluedPaths = [
    '/cases',
    '/volunteers',
    '/resources',
    '/stories'
  ];

  const shouldApply = incluedPaths.some(path => req.url.includes(path));

  if (shouldApply && token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `${token.tokenType} ${token.accessToken}`,
      },
    });
    return next(clonedReq);
  }
  return next(req);
};
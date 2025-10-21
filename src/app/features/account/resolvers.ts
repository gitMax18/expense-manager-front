import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RedirectCommand,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Account } from './types';
import { AccountService } from './account-service';
import { catchError, map, of } from 'rxjs';

export const accountResolver: ResolveFn<Account> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const accountId = route.paramMap.get('id')!;

  return accountService.getAccountById(accountId).pipe(
    map((response) => response.data),
    catchError((error) => {
      return of(new RedirectCommand(router.parseUrl('/accounts')));
    })
  );
};

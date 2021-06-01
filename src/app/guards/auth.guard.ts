import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Promise( async (resolve,reject)=>{
        const user = await this.authService.getUser();
        //console.log(user);
        if (user){
          //console.log('guard true');
          resolve(true);
          //return true;
        }else{
          //console.log('guard false');
          //reject(this.router.createUrlTree(['/login']));
          this.router.navigateByUrl('/login');
          reject('No user logged in');
          //return false;
        }
      });
  }

}
